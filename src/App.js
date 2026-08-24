import Home from './pages/Home.js'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ContactPage from './pages/ContactPage.js';
import ServicesPage from './pages/ServicesPage.js';
import AboutPage from './pages/AboutPage.js';
import BlogsPage from './pages/BlogsPage.js';
import BlogDetailsPage from './pages/BlogDetails.js';
import ProductDetails from './pages/ProductDetails.js';
import ProductsPage from './pages/ProductsPage.js';
import CategoryProductsPage from './pages/CategoryProductsPage.js';
import Careers from './pages/CareersPage.js';
import Support from './pages/SupportPage.js';
import ResourcesPage from './pages/ResourcesPage.js';
import SideButtons from './components/SideButton.js';
import SearchBar from './components/SearchBar.js';
import SearchResults from './pages/SearchPage.js';
import AdminPanel from './pages/AdminPannel.js';
import PrivacyPolicy from './Policies/PrivacyPolicy.js';
import TermsOfService from './Policies/TermsOfService.js';
import CookiePolicy from './Policies/CookiePolicy.js';
import SmartApplicationLab from './pages/SmartApplicationLab.js';
import NotFound from './views/PageNotFound.js';
import CookieConsent from './components/CookieConsent.js';

const App = () => {
  return (
    <>
      <SideButtons />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/products' element={<ProductsPage />} />
        {/* <Route path='/category' element={<CategoryProductsPage />} />
        <Route path='/category/:categoryName' element={<CategoryProductsPage />} /> */}
        <Route path='/product/:productId' element={<ProductDetails />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/services' element={<ServicesPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/blogs' element={<BlogsPage />} />
        <Route path='/blog/:slug' element={<BlogDetailsPage />} />
        <Route path='/career' element={<Careers />} />
        <Route path='/support' element={<Support />} />
        <Route path='/resources' element={<ResourcesPage />} />
        <Route path='/smart-application-lab' element={<SmartApplicationLab />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/admin' element={<AdminPanel />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
       <CookieConsent />
    </>
  )
}

export default App;