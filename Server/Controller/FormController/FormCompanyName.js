const CompanyName = require("../../Models/Forms/CompanyName");

/* ============ CREATE ============ */
exports.createCompanyName = async (req, res) => {
  try {
    const { companyName, productId } = req.body;

    if (!companyName || !productId) {
      return res.status(400).json({
        success: false,
        message: "Company name and product are required",
      });
    }

    const exists = await CompanyName.findOne({ companyName, productId });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Company already exists for this product",
      });
    }

    const company = await CompanyName.create({ companyName, productId });

    res.status(201).json({
      success: true,
      message: "Company name created",
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ============ READ ============ */
exports.getAllCompanyNames = async (req, res) => {
  try {
    const companies = await CompanyName.find()
      .populate("productId", "name")   // ⭐ REQUIRED
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompaniesByProduct = async (req, res) => {
  try {
    const companies = await FormCompany.find({
      productId: req.params.productId,
    });

    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




/* ============ UPDATE ============ */
exports.updateCompanyName = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, productId } = req.body;

    if (!companyName || !productId) {
      return res.status(400).json({
        success: false,
        message: "Company name and product are required",
      });
    }

    const updatedCompany = await CompanyName.findByIdAndUpdate(
      id,
      { companyName, productId },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company name updated",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ============ DELETE ============ */
exports.deleteCompanyName = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCompany = await CompanyName.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company name deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
