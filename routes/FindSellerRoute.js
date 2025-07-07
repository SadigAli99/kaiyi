const express = require("express");
const FindSellerModel = require("../models/FindSellerModel");
const upload = require("../config/MulterConfig");
const router = express.Router();

router.post("/city", upload.single("img"), async (req, res) => {
  try {
    const requiredFields = ["cityNameAz", "cityNameEn", "cityNameRu", "lat", "lng"];
    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ fieldError: `missing fields ${field}` });
      }

      const serviceIcon = req.file ? `/public2/${req.file.filename}` : "";

      const savedData = new FindSellerModel({
        cityName: {
          az: req.body.cityNameAz,
          en: req.body.cityNameEn,
          ru: req.body.cityNameRu,
        },
        coordinates: {
          lat: Number(req.body.lat),
          lng: Number(req.body.lng),
        },
        informations: [
          {
            title: {
              az: req.body.titleAz,
              en: req.body.titleEn,
              ru: req.body.titleRu,
            },
            value: {
              az: req.body.valueAz,
              en: req.body.valueEn,
              ru: req.body.valueRu,
            },
          },
        ],
        otherServices: [
          {
            serviceIcon: serviceIcon,
            serviceName: {
              az: req.body.serviceNameAz,
              en: req.body.serviceNameEn,
              ru: req.body.serviceNameRu,
            },
          },
        ],
        websiteLink: req.body.websiteLink,
      });

      const saveData = await savedData.save();

      return res.status(200).json({ savedData: saveData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/city/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const serviceIcon = req.file ? `/public2/${req.file.filename}` : "";

    const { cityNameAz, cityNameEn, cityNameRu, lat, lng } = req.body;

    const updatedData = await FindSellerModel.findByIdAndUpdate(
      id,
      {
        $set: {
          cityName: {
            az: cityNameAz,
            en: cityNameEn,
            ru: cityNameRu,
          },
          coordinates: {
            lat: Number(lat),
            lng: Number(lng),
          },
          informations: [
            {
              title: {
                az: req.body.titleAz,
                en: req.body.titleEn,
                ru: req.body.titleRu,
              },
              value: {
                az: req.body.valueAz,
                en: req.body.valueEn,
                ru: req.body.valueRu,
              },
            },
          ],
          otherServices: [
            {
              serviceIcon: serviceIcon,
              serviceName: {
                az: req.body.serviceNameAz,
                en: req.body.serviceNameEn,
                ru: req.body.serviceNameRu,
              },
            },
          ],
          websiteLink: req.body.websiteLink,
          status: req.body.status,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedData) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/city/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await FindSellerModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await FindSellerModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/city", async (req, res) => {
  try {
    const data = await FindSellerModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ cities: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/cityfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage ? acceptLanguage.split(",")[0].split(";")[0] : "az";

    const datas = await FindSellerModel.find({ status: "active" });

    const filteredData = datas.map((data) => ({
      _id: data._id,
      cityName: data.cityName[preferredLanguage] || data.cityName["az"],
      coordinates: data.coordinates,
      informations: data.informations.map((info) => ({
        title: info.title[preferredLanguage] || info.title["az"],
        value: info.value[preferredLanguage] || info.value["az"],
        _id: info._id,
      })),
      otherServices: data.otherServices.map((service) => ({
        serviceName: service.serviceName[preferredLanguage] || service.serviceName["az"],
        _id: service._id,
        serviceIcon: service.serviceIcon,
      })),
      websiteLink: data.websiteLink,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-city/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await FindSellerModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get("/status-city/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const city = await FindSellerModel.findById(id, "status");

    if (!city) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: city.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
