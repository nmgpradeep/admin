import React from 'react';
import Loadable from 'react-loadable'

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

const Tooltips = Loadable({
  loader: () => import('./views/Base/Tooltips'),
  loading: Loading,
});

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

// Loder for Users
const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});
const UserEdit = Loadable({
  loader: () => import('./views/Users/UserEdit'),
  loading: Loading,
});
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


//loader for product
const Donations = Loadable({
  loader: () => import('./views/Donations/Donations'),
  loading: Loading,
});
const DonationAdd = Loadable({
  loader: () => import('./views/Donations/DonationAdd'),
  loading: Loading,
});
const DonationView = Loadable({
  loader: () => import('./views/Donations/DonationView'),
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
})

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users/add', exact: true,name: 'Add User', component: UserAdd },
  { path: '/users/edit/:id',name: 'Edit User', component: UserEdit },
  { path: '/users/view/:id', name: 'View User', component: UserView },
  { path: '/users', name: 'Users', component: Users },
  { path: '/categories/add', exact: true,name: 'Add Category', component: CategoryAdd },
  { path: '/categories/edit/:id', name: 'Edit Category', component: CategoryEdit },
  { path: '/categories/view/:id', name: 'View Category', component: CategoryView },
  { path: '/categories', name: 'Categories', component: Categories },
  { path: '/products/add', exact: true,name: 'Add Product', component: ProductAdd },
  { path: '/products/edit/:id',name: 'Edit Product', component: ProductEdit },
  { path: '/products/view/:id', name: 'View Product', component: ProductView },
  { path: '/products', name: 'Products', component: Products },
  { path: '/trades', name: 'Trades', component: Trades },

  { path: '/donations/add', exact: true,name: 'Add Donation', component: DonationAdd },
  { path: '/donations/view/:id', name:'View Donation', component:DonationView },
  { path: '/donations', name: 'Donations', component: Donations },
  { path: '/pages/add', exact: true,name: 'New Page', component: CmsPageAdd},
  { path: '/pages/edit/:id',  name:'Edit Page', component:CmsPageEdit},
  { path: '/pages', name: 'CMS Pages', component: CmsPages },

  { path: '/advertisement/add', exact: true,name: 'Add Advertisement', component: AdvertisementAdd },
  { path: '/advertisement/edit/:id', name: 'Edit Advertisement', component: AdvertisementEdit },
  { path: '/advertisement/view/:id', name: 'View Advertisement', component: AdvertisementView },
  { path: '/advertisement', name: 'Advertisement', component: Advertisements },

  //~ { path: '/theme', exact: true, name: 'Theme', component: Colors },
  //~ { path: '/theme/colors', name: 'Colors', component: Colors },
  //~ { path: '/theme/typography', name: 'Typography', component: Typography },
  //~ { path: '/base', exact: true, name: 'Base', component: Cards },
  //~ { path: '/base/cards', name: 'Cards', component: Cards },
  //~ { path: '/base/forms', name: 'Forms', component: Forms },
  //~ { path: '/base/switches', name: 'Switches', component: Switches },
  //~ { path: '/base/tables', name: 'Tables', component: Tables },
  //~ { path: '/base/tabs', name: 'Tabs', component: Tabs },
  //~ { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  //~ { path: '/base/carousels', name: 'Carousel', component: Carousels },
  //~ { path: '/base/collapses', name: 'Collapse', component: Collapses },
  //~ { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  //~ { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  //~ { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  //~ { path: '/base/navbars', name: 'Navbars', component: Navbars },
  //~ { path: '/base/navs', name: 'Navs', component: Navs },
  //~ { path: '/base/paginations', name: 'Paginations', component: Paginations },
  //~ { path: '/base/popovers', name: 'Popovers', component: Popovers },
  //~ { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  //~ { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  //~ { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  //~ { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  //~ { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  //~ { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  //~ { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  //~ { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  //~ { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  //~ { path: '/icons/flags', name: 'Flags', component: Flags },
  //~ { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  //~ { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
];

export default routes;
