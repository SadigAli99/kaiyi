const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectDB = require('./config/connect');
const app = express();
dotenv.config(); //connect .env
const PORT = 3000 || process.env.PORT; //connect port
const mongoose = require('mongoose');

// imports
const LogoRoute = require('./routes/LogoRoute');
const LocationRoute = require('./routes/LocationRoute');
const TelephoneRoute = require('./routes/TelephoneRoute');
const HeroRoute = require('./routes/Hero');
const DesignTabRoute = require('./routes/tabs/Design');
const InterierTabRoute = require('./routes/tabs/Interier');
const SecurityTabRoute = require('./routes/tabs/Security');
const ComfortableTabRoute = require('./routes/tabs/Comfortable');
const ViewTabRoute = require('./routes/tabs/View');
const ModelsRoute = require('./routes/tabs/Models');
const NewsRoute = require('./routes/tabs/News');
const SubscribeNews = require('./routes/SubscribeNews');
const BecomeDealer = require('./routes/BecomeDealer');
const Translates = require('./routes/Translates');
const FindSeller = require('./routes/FindSellerRoute');
const VideoTabModelRoute = require('./routes/modelinnertabs/VideoTabModelRoute');
const DesignTabModelRoute = require('./routes/modelinnertabs/DesignTabModelRoute');
const InterierTabModelRoute = require('./routes/modelinnertabs/InterierTabModelRoute');
const ComfortTabModelRoute = require('./routes/modelinnertabs/ComfortTabModelRoute');
const SecurityTabModelRoute = require('./routes/modelinnertabs/SecTabModelRoute');
const ModelPdfInnerRoute = require('./routes/modelinnertabs/ModelPdfRoute');
const TestDriveRoute = require('./routes/TestDriveRoute');
const TestDriveUsersRoute = require('./routes/TestDriveUserRoute');
const ForCorporateCustomersRoute = require('./routes/ForCorporateCustomerRoute');
const ForCorporateCustomersRegistersRoute = require('./routes/ForCorporateCustomersRegistersRoute');
const OurAdvantagesRoute = require('./routes/OurAdvantagesRoute');
const KaiyiGuarantHeroRoute = require('./routes/guarantkaiyi/GuarantHeroRoute');
const KaiyiGuarantDescriptionRoute = require('./routes/guarantkaiyi/GuarantDescriptionRoute');
const KaiyiGuarantAttentionRoute = require('./routes/guarantkaiyi/GuarantAttentionRoute');
const TrafficRulesHeroRoute = require('./routes/trafficrules/TrafficRulesHeroRoute');
const TrafficRulesCallRoute = require('./routes/trafficrules/TrafficRulesCallRoute');
const TrafficRulesHelpedRoute = require('./routes/trafficrules/TrafficRulesHelpedRoute');
const TrafficRulesBottomRoute = require('./routes/trafficrules/TrafficRulesBottomRoute');
const RepairAndMaintenanceHeroRoute = require('./routes/repair/RepairAndMaintenanceRouteHero');
const RepairAndMaintenanceRulesDownloadRoute = require('./routes/repair/RepairRulesDownloadRoute');
const KaiyiHistoryHeroRoute = require('./routes/historykaiyi/KaiyiHistoryHeroRoute');
const KaiyiHistoryBottomRoute = require('./routes/historykaiyi/KaiyiHistoryBottomRoute');
const KaiyiHistoryBlogRoute = require('./routes/historykaiyi/KaiyiHistoryBlogRoute');
const KaiyiHistoryNewsRoute = require('./routes/historykaiyi/KaiyiHistoryNewsRoute');
const KaiyiHistoryContactHeroRoute = require('./routes/historykaiyi/KaiyiContactHeroRoute');
const KaiyiHistoryContactFeedbacksRoute = require('./routes/historykaiyi/KaiyiContactFeedbackRoute');
const AddDealerRoute = require('./routes/AddDealerRoute');
const DealerContactsRoute = require('./routes/DealerContactsRoute');
const DealerContactsServiceRoute = require('./routes/DealerContactServiceRoute');
const AddCarsRoute = require('./routes/addcar/AddCarRoute');
const SocialMediaRoute = require('./routes/SocialMediaRoute');
const ContactManagerRoute = require('./routes/ContactManagerRoute');
const UsersRoute = require('./routes/users/UsersRoute');
const HomeRoute = require('./routes/seo/Homeroute');
const CarsInStockSeoRoute = require('./routes/seo/CarsInStockRoute');
const PointSaleRoute = require('./routes/seo/PointSaleRoute');
const SeoTestDriveRoute = require('./routes/seo/TestDriveRoute');
const SeoCorporateRoute = require('./routes/seo/CorporateSeoRoute');
const KaiyiGarantSeoRoute = require('./routes/seo/KaiyiGarantRoute');
const RoadRulesRoute = require('./routes/seo/RoadRulesRoute');
const RepairSeoRoute = require('./routes/seo/RepairRoute');
const KaiyiMarkaModel = require('./routes/seo/KaiyiMarkaRoute');
const BlogSeoRoute = require('./routes/seo/BlogSeoRoute');
const NewSeoRoute = require('./routes/seo/NewSeoRoute');
const ContactSeoRoute = require('./routes/seo/ContactSeoRoute');

ConnectDB();

app.use(express.json());

app.use(cors({ origin: '*' }));

app.use('/public', express.static('/var/data'));

// app.use("/public", express.static(path.join(__dirname, "public")));

const apis = [
  Translates,
  LogoRoute,
  LocationRoute,
  TelephoneRoute,
  HeroRoute,
  DesignTabRoute,
  InterierTabRoute,
  SecurityTabRoute,
  ViewTabRoute,
  ComfortableTabRoute,
  ModelsRoute,
  NewsRoute,
  SubscribeNews,
  BecomeDealer,
  FindSeller,
  VideoTabModelRoute,
  DesignTabModelRoute,
  InterierTabModelRoute,
  ComfortTabModelRoute,
  SecurityTabModelRoute,
  ModelPdfInnerRoute,
  TestDriveRoute,
  TestDriveUsersRoute,
  ForCorporateCustomersRoute,
  OurAdvantagesRoute,
  ForCorporateCustomersRegistersRoute,
  KaiyiGuarantHeroRoute,
  KaiyiGuarantDescriptionRoute,
  KaiyiGuarantAttentionRoute,
  TrafficRulesHeroRoute,
  TrafficRulesCallRoute,
  TrafficRulesHelpedRoute,
  TrafficRulesBottomRoute,
  RepairAndMaintenanceHeroRoute,
  RepairAndMaintenanceRulesDownloadRoute,
  KaiyiHistoryHeroRoute,
  KaiyiHistoryBottomRoute,
  KaiyiHistoryBlogRoute,
  KaiyiHistoryNewsRoute,
  KaiyiHistoryContactHeroRoute,
  KaiyiHistoryContactFeedbacksRoute,
  AddDealerRoute,
  DealerContactsRoute,
  DealerContactsServiceRoute,
  AddCarsRoute,
  SocialMediaRoute,
  ContactManagerRoute,
  UsersRoute,
  // SEO adventures
  HomeRoute,
  CarsInStockSeoRoute,
  PointSaleRoute,
  SeoTestDriveRoute,
  SeoCorporateRoute,
  KaiyiGarantSeoRoute,
  RoadRulesRoute,
  RepairSeoRoute,
  KaiyiMarkaModel,
  BlogSeoRoute,
  NewSeoRoute,
  ContactSeoRoute,
];

apis.forEach((apis) => {
  app.use('/api', apis);
});

//get endpoint lengths
app.get('/api/get-all-endpoint-lengths', async (req, res) => {
  try {
    const endpointLengths = apis ? apis?.length : 0;
    res.status(200).json(endpointLengths);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//get db collection length
app.get('/api/get-db-collection-lengths', async (req, res) => {
  try {
    const dbcLengths = await mongoose.connection.db.listCollections().toArray();
    res.status(200).json(dbcLengths?.length);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(PORT, 'Server is runnning');
});
