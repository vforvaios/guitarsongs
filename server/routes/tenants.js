const express = require("express");
const Tenant = require("../controllers/tenants.controller");

const router = express.Router();

router.get("/:id", Tenant.getWholeTenant);
router.get(
  "/:tenantId/section/:sectionId/details",
  Tenant.getTenantSectionDetails
);
router.get("/:tenantId/services", Tenant.getTenantServices);

module.exports = router;
