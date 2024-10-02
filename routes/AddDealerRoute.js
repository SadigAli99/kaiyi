const express = require("express");
const router = express.Router();
const AddDealerModel = require("../models/AddDealerModel");
const upload = require("../config/MulterConfig");

router.post("/add-dealer", upload.none(), async (req, res) => {
  try {
    const requiredFields = ["dealerNameAz", "dealerNameEn", "dealerNameRu"];

    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing field ${field}!` });
      }
    }

    const createData = new AddDealerModel({
      dealerName: {
        az: req.body.dealerNameAz,
        en: req.body.dealerNameEn,
        ru: req.body.dealerNameRu,
      },
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/add-dealer/:id", upload.none(), async (req, res) => {
  try {
    const { id } = req.params;

    const { dealerNameAz, dealerNameEn, dealerNameRu } = req.body;

    const updatedData = await AddDealerModel.findByIdAndUpdate(
      id,
      {
        $set: {
          dealerName: {
            az: dealerNameAz,
            en: dealerNameEn,
            ru: dealerNameRu,
          },
          status: req.body.status,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedData) {
      return res.status(400).json({ message: "not found editid" });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/add-dealer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AddDealerModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await AddDealerModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/add-dealerfront", async (req, res) => {
  try {
     const acceptLanguage = req.headers["accept-language"];
     const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];
 
     const datas = await AddDealerModel.find({ status: "active" });
 
     const filteredData = datas?.map((data) => ({
       _id: data._id,
       dealerName: data.dealerName[preferredLanguage],
       status: data.status,
     }));
 
     return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/add-dealer", async (req, res) => {
  try {
    const data = await AddDealerModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-add-dealer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await AddDealerModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get("/status-add-dealer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AddDealerModel.findById(id, "status");

    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
