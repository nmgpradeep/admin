import React from 'react';
import Loadable from 'react-loadable';

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Breadcrumbs = Loadable({
  loader: () => import('./views/Base/Breadcrumbs'),
  loading: Loading,
});

const Cards = Loadable({
  loader: () => import('./views/Base/Cards'),
  loading: Loading,
});

const Carousels = Loadable({
  loader: () => import('./views/Base/Carousels'),
  loading: Loading,
});

const Collapses = Loadable({
  loader: () => import('./views/Base/Collapses'),
  loading: Loading,
});

const Dropdowns = Loadable({
  loader: () => import('./views/Base/Dropdowns'),
  loading: Loading,
});

const Forms = Loadable({
  loader: () => import('./views/Base/Forms'),
  loading: Loading,
});

const Jumbotrons = Loadable({
  loader: () => import('./views/Base/Jumbotrons'),
  loading: Loading,
});

const ListGroups = Loadable({
  loader: () => import('./views/Base/ListGroups'),
  loading: Loading,
});

const Navbars = Loadable({
  loader: () => import('./views/Base/Navbars'),
  loading: Loading,
});

const Navs = Loadable({
  loader: () => import('./views/Base/Navs'),
  loading: Loading,
});

const Paginations = Loadable({
  loader: () => import('./views/Base/Paginations'),
  loading: Loading,
});

const Popovers = Loadable({
  loader: () => import('./views/Base/Popovers'),
  loading: Loading,
});

const ProgressBar = Loadable({
  loader: () => import('./views/Base/ProgressBar'),
  loading: Loading,
});

const Switches = Loadable({
  loader: () => import('./views/Base/Switches'),
  loading: Loading,
});

const Tables = Loadable({
  loader: () => import('./views/Base/Tables'),
  loading: Loading,
});

const Tabs = Loadable({
  loader: () => import('./views/Base/Tabs'),
  loading: Loading,
});

//~ const Tooltips = Loadable({
  //~ loader: () => import('./views/Base/Tooltips'),
  //~ loading: Loading,
//~ });

const BrandButtons = Loadable({
  loader: () => import('./views/Buttons/BrandButtons'),
  loading: Loading,
});

const ButtonDropdowns = Loadable({
  loader: () => import('./views/Buttons/ButtonDropdowns'),
  loading: Loading,
});

const ButtonGroups = Loadable({
  loader: () => import('./views/Buttons/ButtonGroups'),
  loading: Loading,
});

const Buttons = Loadable({
  loader: () => import('./views/Buttons/Buttons'),
  loading: Loading,
});

const Charts = Loadable({
  loader: () => import('./views/Charts'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const CoreUIIcons = Loadable({
  loader: () => import('./views/Icons/CoreUIIcons'),
  loading: Loading,
});

const Flags = Loadable({
  loader: () => import('./views/Icons/Flags'),
  loading: Loading,
});

const FontAwesome = Loadable({
  loader: () => import('./views/Icons/FontAwesome'),
  loading: Loading,
});

const SimpleLineIcons = Loadable({
  loader: () => import('./views/Icons/SimpleLineIcons'),
  loading: Loading,
});

const Alerts = Loadable({
  loader: () => import('./views/Notifications/Alerts'),
  loading: Loading,
});

const Badges = Loadable({
  loader: () => import('./views/Notifications/Badges'),
  loading: Loading,
});

const Modals = Loadable({
  loader: () => import('./views/Notifications/Modals'),
  loading: Loading,
});

const Colors = Loadable({
  loader: () => import('./views/Theme/Colors'),
  loading: Loading,
});

const Typography = Loadable({
  loader: () => import('./views/Theme/Typography'),
  loading: Loading,
});

const Widgets = Loadable({
  loader: () => import('./views/Widgets/Widgets'),
  loading: Loading,
});
const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});
const UserEdit = Loadable({
  loader: () => import('./views/Users/UserEdit'),
  loading: Loading,
});
const AdminProfile = Loadable({
  loader: () => import('./views/Users/profile'),
  loading: Loading,
});
// const EditProfile = Loadable({
//   loader: () => import('./views/AdminProfile/EditProfile'),
//   loading: Loading,
// });
const UserAdd = Loadable({
  loader: () => import('./views/Users/UserAdd'),
  loading: Loading,
});
const UserView = Loadable({
  loader: () => import('./views/Users/UserView'),
  loading: Loading,
});
//loader for category
const Categories = Loadable({
  loader: () => import('./views/Categories/Categories'),
  loading: Loading,
});
const CategoryEdit = Loadable({
  loader: () => import('./views/Categories/CategoryEdit'),
  loading: Loading,
});
const CategoryAdd = Loadable({
  loader: () => import('./views/Categories/CategoryAdd'),
  loading: Loading,
});
const CategoryView = Loadable({
  loader: () => import('./views/Categories/CategoryView'),
  loading: Loading,
});
//loader for product
const Products = Loadable({
  loader: () => import('./views/Products/Products'),
  loading: Loading,
});
const ProductEdit = Loadable({
  loader: () => import('./views/Products/ProductEdit'),
  loading: Loading,
});
const ProductAdd = Loadable({
  loader: () => import('./views/Products/ProductAdd'),
  loading: Loading,
});
const ProductView = Loadable({
  loader: () => import('./views/Products/ProductView'),
  loading: Loading,
});
//~ //loader for product
const Trades = Loadable({
  loader: () => import('./views/Trades/Trades'),
  loading: Loading,
});
const NewTrade = Loadable({
  loader: () => import('./views/Trades/TradesAdd'),
  loading: Loading,
});
const TradesView = Loadable({
  loader: () => import ('./views/Trades/TradesView.js'),
  loading: Loading,
});


//loader for CMS Pages
const CmsPages = Loadable({
  loader: () => import('./views/CmsPages/CmsPages'),
  loading: Loading,
});
const CmsPageAdd = Loadable({
  loader: () => import('./views/CmsPages/CmsPageAdd'),
  loading: Loading,
});
const CmsPageEdit = Loadable({
  loader: () => import('./views/CmsPages/CmsPageEdit'),
  loading: Loading,
});
const CmsPageView = Loadable({
  loader: () => import('./views/CmsPages/CmsPageView'),
  loading: Loading,
})

// loader for advertisement by saurabh
const Advertisements = Loadable({
  loader: () => import('./views/Advertisement/Advertisements'),
  loading: Loading,
});
const AdvertisementAdd = Loadable({
  loader: () => import('./views/Advertisement/AdvertisementAdd'),
  loading: Loading,
});
const AdvertisementEdit = Loadable({
  loader: () => import('./views/Advertisement/AdvertisementEdit'),
  loading: Loading, 
});
const AdvertisementView = Loadable({
  loader: () => import('./views/Advertisement/AdvertisementView'),
  loading: Loading,

});

//loding Subscription component
const Subscriptions = Loadable({
	loader : () => import('./views/Subscriptions/Subscriptions'),
	loading: Loading,
});

const SubscriptionAdd = Loadable({
	loader : () => import('./views/Subscriptions/SubscriptionAdd'),
	loading : Loading,
});

const SubscriptionEdit = Loadable({
  loader: () => import('./views/Subscriptions/SubscriptionEdit'),
  loading: Loading,
});

const SubscriptionView = Loadable({
  loader: () => import('./views/Subscriptions/SubscriptionView'),
  loading: Loading,
});


// Loading transaction component
const Transactions = Loadable({
  loader: () => import('./views/Transactions/Transactions'),
  loading: Loading,
});
const TransactionView = Loadable({
  loader: () => import('./views/Transactions/TransactionView'),
  loading: Loading,
});
//loader for donations by saurabh
const Donations = Loadable({
  loader: () => import('./views/Donation/Donations'),
  loading: Loading,
});
const DonationAdd = Loadable({
  loader: () => import('./views/Donation/DonationAdd'),
  loading: Loading,
});
const DonationView = Loadable({
  loader: () => import('./views/Donation/DonationView'),
  loading: Loading,
});
const DonationEdit = Loadable({
  loader: () => import('./views/Donation/DonationEdit'),
  loading: Loading,

})

//loader for Testimonials by Saurabh
const Testimonials = Loadable({
  loader: () => import('./views/Testimonial/Testimonials'),
  loading: Loading,
});
const TestimonialAdd = Loadable({
  loader: () => import('./views/Testimonial/TestimonialAdd'),
  loading: Loading,
});
const TestimonialView = Loadable({
  loader: () => import('./views/Testimonial/TestimonialView'),
  loading: Loading,
});
const TestimonialEdit = Loadable({
  loader: () => import('./views/Testimonial/TestimonialEdit'),
  loading: Loading,
})

//loader for Addon by Saurabh
const Addons = Loadable({
  loader: () => import('./views/Subscriptions/Addons'),
  loading: Loading,
});
const AddonAdd = Loadable({
  loader: () => import('./views/Subscriptions/AddonAdd'),
  loading: Loading,
});
const AddonEdit = Loadable({
  loader: () => import('./views/Subscriptions/AddonEdit'),
  loading: Loading,
});

//loader for Brands by Saurabh
const Brands = Loadable({
  loader: () => import('./views/Attributes/Brands'),
  loading: Loading,
});
const BrandAdd = Loadable({
  loader: () => import('./views/Attributes/BrandAdd'),
  loading: Loading,
});
const BrandEdit = Loadable({
  loader: () => import('./views/Attributes/BrandEdit'),
  loading: Loading,
});
const Sizes = Loadable({
  loader: () => import('./views/Attributes/Sizes'),
  loading: Loading,
});
const SizeAdd = Loadable({
  loader: () => import('./views/Attributes/SizeAdd'),
  loading: Loading,
})
const SizeEdit = Loadable({
  loader: () => import('./views/Attributes/SizeEdit'),
  loading: Loading,
});

//loader for Country by Saurabh
const Countries = Loadable({
  loader: () => import('./views/Location/Countries'),
  loading: Loading,
});
const CountryAdd = Loadable({
  loader: () => import('./views/Location/CountryAdd'),
  loading: Loading,
});
const CountryEdit = Loadable({
  loader: () => import('./views/Location/CountryEdit'),
  loading: Loading,
})

//loader for States by Saurabh
const States = Loadable({
  loader: () => import('./views/Location/States'),
  loading: Loading,
});
const StateAdd = Loadable({
  loader: () => import('./views/Location/StateAdd'),
  loading: Loading,
});
const StateEdit = Loadable({
  loader: () => import('./views/Location/StateEdit'),
  loading: Loading,
});
//loader for Citys by Saurabh
const Cities = Loadable({
  loader: () => import('./views/Location/Cities'),
  loading: Loading,
});
const CityAdd = Loadable({
  loader: () => import('./views/Location/CityAdd'),
  loading: Loading,
});
const CityEdit = Loadable({
  loader: () => import('./views/Location/CityEdit'),
  loading: Loading,
});

// Email Notification setting
const EmailNotification = Loadable({
	loader:() => import('./views/Notifications/EmailNotification/EmailNotification'),
	loading : Loading,
});

const ForgetPassword = Loadable({
  loader:() => import('./views/Pages/Login/ForgetPassword'),
  loading : Loading,
});
const ResetPassword = Loadable({
  loader: () => import('./views/Pages/Login/ResetPassword'),
  loading : Loading,
});
const MyProfile = Loadable({
  loader: () => import('./views/AdminProfile/Profile'),
  loading : Loading,
});
const EditProfile = Loadable({
  loader: () => import('./views/AdminProfile/EditProfile'),
  loading : Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/forgotPassword', exact: true, name: 'Forget Password', component: ForgetPassword},
  { path: '/resetPassword/:id', name: 'Reset Password', component: ResetPassword},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users/add', exact: true,name: 'Add User', component: UserAdd },
  { path: '/users/edit/:id',name: 'Edit User', component: UserEdit },
  { path: '/users/view/:id', name: 'View User', component: UserView },  
  { path: '/users', name: 'Users', component: Users },   
  { path: '/profile',name: 'Profile', component: AdminProfile },  
  { path: '/categories/add', exact: true,name: 'Add Category', component: CategoryAdd },
  { path: '/categories/edit/:id', name: 'Edit Category', component: CategoryEdit },
  { path: '/categories/view/:id', name: 'View Category', component: CategoryView },
  { path: '/categories', name: 'Categories', component: Categories },    
  { path: '/products/add', exact: true,name: 'Add Product', component: ProductAdd },
  { path: '/products/edit/:id',name: 'Edit Product', component: ProductEdit },
  { path: '/products/view/:id', name: 'View Product', component: ProductView },
  { path: '/products', name: 'Products', component: Products },  
  { path: '/trades/add', name: 'Trades Add', component: NewTrade},
  { path: '/trades/view/:id', name: 'Trades View', component: TradesView},
  { path: '/trades', name: 'Trades', component: Trades },
  { path: '/donations/add', exact: true,name: 'Add Donation', component: DonationAdd },
  { path: '/donations/edit/:id', name: 'Edit Donation', component: DonationEdit},
  { path: '/donations/view/:id', name:'View Donation', component:DonationView },
  { path: '/donations', name: 'Donations', component: Donations },  
  { path: '/pages/add', exact: true,name: 'New Page', component: CmsPageAdd},
  { path: '/pages/edit/:id',  name:'Edit Page', component:CmsPageEdit},
  { path: '/pages/view/:id', name: 'View Page', component: CmsPageView},
  { path: '/pages', name: 'CMS Pages', component: CmsPages },
  { path: '/advertisement/add', exact: true,name: 'Add Advertisement', component: AdvertisementAdd },
  { path: '/advertisement/edit/:id', name: 'Edit Advertisement', component: AdvertisementEdit },
  { path: '/advertisement/view/:id', name: 'View Advertisement', component: AdvertisementView },
  { path: '/advertisement', name: 'Advertisement', component: Advertisements },  
  { path: '/subscriptions/add', exact: true, name: 'Add Subscription', component : SubscriptionAdd },
  { path: '/subscriptions/edit/:id', name:'Edit Subscription', component: SubscriptionEdit},
  { path: '/subscriptions/view/:id', name: 'View Subscription', component: SubscriptionView},   
  { path: '/subscriptions', exact:true, name: 'Subscriptions', component: Subscriptions },  
  { path: '/addon/add', exact: true, name: 'Add Addon', component: AddonAdd},
  { path: '/addon/edit/:id', name: 'Edit Addon', component: AddonEdit},
  { path: '/addon', name: 'Addons', component: Addons}, 
  { path: '/transactions/view/:id', name: 'View Transactions', component: TransactionView },
  { path: '/transactions', exact:true, name: 'Transactions', component: Transactions },
  { path: '/testimonial/add', exact: true, name: 'Add Testimonial', component: TestimonialAdd},
  { path: '/testimonial/edit/:id', name: 'Edit Testimonial', component: TestimonialEdit},
  { path: '/testimonial/view/:id', name: 'View Testimonial', component: TestimonialView},
  { path: '/testimonial', name: 'Testimonial', component: Testimonials},
  { path: '/brand/add', name: 'Add Brand', component: BrandAdd},
  { path: '/brand/edit/:id', name: 'Edit Brand', component: BrandEdit},
  { path: '/brand', name: 'Brand', component: Brands},
  { path: '/size/add', name: 'Add Sizes', component: SizeAdd},
  { path: '/size/edit/:id', name: 'Edit Sizes', component: SizeEdit},
  { path: '/size', name: 'Sizes', component: Sizes},
  { path: '/country/add', name: 'Add Country',component: CountryAdd},
  { path: '/country/edit/:id', name: 'Edit Country', component: CountryEdit},
  { path: '/country', name: 'Country', component: Countries},
  { path: '/state/add', name: 'Add State', component: StateAdd},
  { path: '/state/edit/:id', name: 'Edit State', component: StateEdit},
  { path: '/state', name: 'State', component: States},
  { path: '/city/add', name: 'Add City', component: CityAdd},
  { path: '/city/edit/:id', name: 'Edit City', component: CityEdit},
  { path: '/city', name: 'City', component: Cities},  
  { path: '/setting/email', name: 'Email Notification', component: EmailNotification},  
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/admin/myProfile', name: 'MyProfile', component: MyProfile },
  { path: '/admin/editProfile', name: 'EditProfile', component: EditProfile },
];

export default routes;
