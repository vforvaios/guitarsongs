const config = require("../config");
const db = require("../services/db");

const getTenantServices = async (req, res, next) => {
  try {
    const tenantName = req.params.tenantId;

    const [services] = await db.query(
      `
      SELECT id, name, duration_minutes, price
      FROM TENANT_SERVICES
      WHERE tenant_id = ? AND isActive = 1
      ORDER BY name
      `,
      [tenantName]
    );

    res.status(200).json(services);
  } catch (error) {
    next(error);
    console.log(error);
    res.status(500).json({ message: config.messages.error });
  }
};

const getWholeTenant = async (req, res, next) => {
  try {
    const tenantName = req.params.id;

    const [
      tenantId,
    ] = await db.query(`SELECT tenant_id FROM TENANTS WHERE name=?`, [
      tenantName,
    ]);
    const [rows] = await db.query(
      `SELECT 
          t.id AS tenant_id,
          t.name AS tenant_name,
          t.tenant_id AS tenant_slug,
          t.template_id AS template_id,
          tmp.isActive AS template_is_active,
          tmp.variant AS template_variant,

          ps.id AS section_id,
          ps.name AS section_name,

          ttps.label AS menu_label,
          ttps.orderId AS orderId,
          ttps.slug AS menu_slug,
          ttps.isActive AS menu_is_active

      FROM TENANTS t

      JOIN TEMPLATES tmp 
          ON tmp.id = t.template_id

      JOIN TEMPLATES_PAGE_SECTIONS tps 
          ON tps.template_id = t.template_id

      JOIN PAGE_SECTIONS ps 
          ON ps.id = tps.page_section_id

      LEFT JOIN TENANTS_TEMPLATES_PAGE_SECTIONS ttps
          ON ttps.tenant_id = t.id
          AND ttps.template_page_section_id = tps.id

      WHERE t.tenant_id = ? AND ttps.isActive = ?
      ORDER BY orderId ASC
      `,
      [tenantId[0].tenant_id, 1]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const first = rows[0];
    const response = {
      tenantId: first.tenant_id,
      tenantSlug: first.tenant_slug,
      tenantName: first.tenant_name,
      template: {
        id: first.template_id,
        isActive: first.template_is_active,
        variant: first.template_variant,
      },
      sections: rows.map((r) => ({
        id: r.section_id,
        name: r.section_name,
        order: r.orderId,
        menu: {
          label: r.menu_label,
          slug: r.menu_slug,
          isActive: r.menu_is_active,
        },
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getTenantSectionDetails = async (req, res, next) => {
  try {
    const { tenantId, sectionId } = req.params;

    const [tenantTemplate] = await db.query(
      `
      SELECT id, template_id
      FROM TENANTS
      WHERE tenant_id=?
      `,
      [tenantId]
    );

    const [section] = await db.query(
      `
      SELECT id
      FROM TEMPLATES_PAGE_SECTIONS
      WHERE page_section_id=? AND template_id=?
      `,
      [sectionId, tenantTemplate[0].template_id]
    );

    const [sectionDetails] = await db.query(
      `
      SELECT richText, singlePhoto, link, photos
      FROM TENANTS_TEMPLATES_PAGE_SECTIONS
      WHERE tenant_id=? AND template_page_section_id=?
      `,
      [tenantTemplate[0].id, section[0].id]
    );
    res.status(200).json({ sectionDetails });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = {
  getTenantServices,
  getWholeTenant,
  getTenantSectionDetails,
};
