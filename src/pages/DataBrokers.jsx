// src/pages/DataBrokers.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AutoRemoval from '../components/AutoRemoval'
import TypewriterText from '../components/TypewriterText'
import Redacted from '../components/Redacted'
import AuthorizationForm from '../components/AuthorizationForm'
import RemovalDashboard from '../components/RemovalDashboard'

const BROKERS = [
  // Data Brokers (30)
  { id: 'acxiom', name: 'Acxiom', category: 'Data Broker', dataCollected: ['Purchase History', 'Demographics', 'Financial Data'], optOutUrl: 'https://www.acxiom.com/optout/', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'epsilon', name: 'Epsilon', category: 'Data Broker', dataCollected: ['Purchase History', 'Email', 'Demographics'], optOutUrl: 'https://www.epsilon.com/us/privacy-policy/privacy-request', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'oracle', name: 'Oracle Data Cloud', category: 'Data Broker', dataCollected: ['Behavioral Data', 'Demographics', 'Purchase History'], optOutUrl: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'lexisnexis', name: 'LexisNexis', category: 'Data Broker', dataCollected: ['Legal Records', 'Financial', 'Address History'], optOutUrl: 'https://optout.lexisnexis.com/', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'corelogic', name: 'CoreLogic', category: 'Data Broker', dataCollected: ['Property Records', 'Financial', 'Address History'], optOutUrl: 'https://www.corelogic.com/privacy-center/', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'equifax', name: 'Equifax', category: 'Data Broker', dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'], optOutUrl: 'https://www.equifax.com/personal/privacy/', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'experian', name: 'Experian', category: 'Data Broker', dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'], optOutUrl: 'https://www.experian.com/privacy/center.html', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'transunion', name: 'TransUnion', category: 'Data Broker', dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'], optOutUrl: 'https://www.transunion.com/legal/privacy-center', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'thomsonreuters', name: 'Thomson Reuters', category: 'Data Broker', dataCollected: ['Legal Records', 'Financial', 'Professional Data'], optOutUrl: 'https://www.thomsonreuters.com/en/privacy-statement.html', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'verisk', name: 'Verisk', category: 'Data Broker', dataCollected: ['Insurance Data', 'Financial', 'Property Records'], optOutUrl: 'https://www.verisk.com/privacy/', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'nielsen', name: 'Nielsen', category: 'Data Broker', dataCollected: ['Media Consumption', 'Demographics', 'Purchase History'], optOutUrl: 'https://www.nielsen.com/us/en/legal/privacy-statement/nielsen-us-opt-out/', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'comscore', name: 'comScore', category: 'Data Broker', dataCollected: ['Browsing History', 'Demographics', 'Media Consumption'], optOutUrl: 'https://www.comscore.com/About/Privacy-Policy', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'neustar', name: 'Neustar', category: 'Data Broker', dataCollected: ['Identity Data', 'Phone', 'Demographics'], optOutUrl: 'https://www.home.neustar/privacy', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'liveramp', name: 'LiveRamp', category: 'Data Broker', dataCollected: ['Identity Data', 'Purchase History', 'Demographics'], optOutUrl: 'https://liveramp.com/opt_out/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'lotame', name: 'Lotame', category: 'Data Broker', dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.lotame.com/about-lotame/privacy/lotames-products-privacy-policy/opt-out/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'bluekai', name: 'BlueKai', category: 'Data Broker', dataCollected: ['Browsing History', 'Interest Profiles', 'Demographics'], optOutUrl: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'mediamath', name: 'MediaMath', category: 'Data Broker', dataCollected: ['Ad Targeting', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.mediamath.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'quantcast', name: 'Quantcast', category: 'Data Broker', dataCollected: ['Browsing History', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.quantcast.com/opt-out/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'tapad', name: 'Tapad', category: 'Data Broker', dataCollected: ['Device Graphs', 'Cross-Device Identity', 'Behavioral Data'], optOutUrl: 'https://www.tapad.com/privacy-policy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'iqvia', name: 'IQVIA', category: 'Data Broker', dataCollected: ['Health Data', 'Prescription Data', 'Demographics'], optOutUrl: 'https://www.iqvia.com/about-us/privacy/individual-rights-request', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'alliant', name: 'Alliant', category: 'Data Broker', dataCollected: ['Purchase History', 'Demographics', 'Financial Data'], optOutUrl: 'https://www.alliantdata.com/privacy-policy/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'cardlytics', name: 'Cardlytics', category: 'Data Broker', dataCollected: ['Purchase History', 'Financial Data', 'Demographics'], optOutUrl: 'https://www.cardlytics.com/consumer-opt-out/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'crossix', name: 'Crossix', category: 'Data Broker', dataCollected: ['Health Data', 'Demographics', 'Behavioral Data'], optOutUrl: 'https://www.veeva.com/privacy/', difficulty: 'medium', estimatedTime: '30 days' },
  { id: 'drawbridge', name: 'Drawbridge', category: 'Data Broker', dataCollected: ['Cross-Device Identity', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.drawbridge.com/privacy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'krux', name: 'Krux Digital', category: 'Data Broker', dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.salesforce.com/products/marketing-cloud/sfmc/audience-studio-consumer-choice/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'addthis', name: 'AddThis', category: 'Data Broker', dataCollected: ['Browsing History', 'Social Sharing Data', 'Interest Profiles'], optOutUrl: 'https://www.oracle.com/legal/privacy/addthis-privacy-policy.html', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'adsquare', name: 'Adsquare', category: 'Data Broker', dataCollected: ['Location Data', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.adsquare.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'exelate', name: 'eXelate', category: 'Data Broker', dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.nielsen.com/us/en/legal/privacy-statement/exelate-privacy-policy/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'zoominfo', name: 'ZoomInfo', category: 'Data Broker', dataCollected: ['Name', 'Email', 'Phone', 'Company', 'Job Title'], optOutUrl: 'https://www.zoominfo.com/about/privacy/privacy-controls', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'yodlee', name: 'Yodlee', category: 'Data Broker', dataCollected: ['Financial Data', 'Transaction History', 'Account Data'], optOutUrl: 'https://www.yodlee.com/legal/privacy-notice', difficulty: 'hard', estimatedTime: '30 days' },

  // Marketing (22)
  { id: 'harte-hanks', name: 'Harte-Hanks', category: 'Marketing', dataCollected: ['Purchase History', 'Demographics', 'Behavioral Data'], optOutUrl: 'https://www.harte-hanks.com/privacy-policy/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'merkle', name: 'Merkle', category: 'Marketing', dataCollected: ['Purchase History', 'Demographics', 'Behavioral Data'], optOutUrl: 'https://www.merkleinc.com/privacy-policy', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'conversant', name: 'Conversant', category: 'Marketing', dataCollected: ['Behavioral Data', 'Ad Targeting', 'Demographics'], optOutUrl: 'https://www.conversantmedia.com/legal/privacy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'dataxu', name: 'DataXu', category: 'Marketing', dataCollected: ['Ad Targeting', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.roku.com/en-us/about/privacy-policy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'dun-bradstreet', name: 'Dun & Bradstreet', category: 'Marketing', dataCollected: ['Business Records', 'Financial Data', 'Professional Data'], optOutUrl: 'https://www.dnb.com/utility-pages/privacy-policy.html', difficulty: 'hard', estimatedTime: '30 days' },
  { id: 'inmarket', name: 'InMarket', category: 'Marketing', dataCollected: ['Location Data', 'Purchase History', 'Behavioral Data'], optOutUrl: 'https://inmarket.com/privacy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'kochava', name: 'Kochava', category: 'Marketing', dataCollected: ['App Usage', 'Device Data', 'Ad Attribution'], optOutUrl: 'https://www.kochava.com/privacy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'placed', name: 'Placed', category: 'Marketing', dataCollected: ['Location Data', 'Ad Attribution', 'Demographics'], optOutUrl: 'https://www.placed.com/privacy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'salesforce-dmp', name: 'Salesforce DMP', category: 'Marketing', dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.salesforce.com/products/marketing-cloud/sfmc/audience-studio-consumer-choice/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'semcasting', name: 'Semcasting', category: 'Marketing', dataCollected: ['IP Targeting', 'Demographics', 'Location Data'], optOutUrl: 'https://semcasting.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'sharethrough', name: 'Sharethrough', category: 'Marketing', dataCollected: ['Ad Targeting', 'Behavioral Data', 'Content Engagement'], optOutUrl: 'https://www.sharethrough.com/privacy-center', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'stirista', name: 'Stirista', category: 'Marketing', dataCollected: ['Identity Data', 'Demographics', 'Purchase History'], optOutUrl: 'https://www.stirista.com/privacy-policy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'taboola', name: 'Taboola', category: 'Marketing', dataCollected: ['Browsing History', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.taboola.com/privacy-policy#optout', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'throtle', name: 'Throtle', category: 'Marketing', dataCollected: ['Identity Data', 'Demographics', 'Purchase History'], optOutUrl: 'https://throtle.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'towerdata', name: 'TowerData', category: 'Marketing', dataCollected: ['Email Intelligence', 'Demographics', 'Identity Data'], optOutUrl: 'https://www.towerdata.com/privacy-policy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'tradedesk', name: 'The Trade Desk', category: 'Marketing', dataCollected: ['Behavioral Data', 'Demographics', 'Ad Targeting'], optOutUrl: 'https://www.thetradedesk.com/us/privacy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'truoptik', name: 'TruOptik', category: 'Marketing', dataCollected: ['OTT/CTV Data', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.truoptik.com/privacy-policy', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'twilio', name: 'Twilio Segment', category: 'Marketing', dataCollected: ['Behavioral Data', 'Identity Data', 'Event Data'], optOutUrl: 'https://segment.com/legal/privacy/', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'viant', name: 'Viant', category: 'Marketing', dataCollected: ['Ad Targeting', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.viantinc.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'weborama', name: 'Weborama', category: 'Marketing', dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'], optOutUrl: 'https://www.weborama.com/privacy-policy/', difficulty: 'easy', estimatedTime: '7 days' },
  { id: 'windfall', name: 'Windfall', category: 'Marketing', dataCollected: ['Wealth Data', 'Demographics', 'Financial Data'], optOutUrl: 'https://www.windfalldata.com/privacy-policy', difficulty: 'medium', estimatedTime: '14 days' },
  { id: 'xandr', name: 'Xandr', category: 'Marketing', dataCollected: ['Ad Targeting', 'Behavioral Data', 'Demographics'], optOutUrl: 'https://www.xandr.com/privacy/', difficulty: 'easy', estimatedTime: '7 days' },

  // People Search (64)
  { id: 'spokeo', name: 'Spokeo', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Relatives'], optOutUrl: 'https://www.spokeo.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'whitepages', name: 'WhitePages', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Age'], optOutUrl: 'https://www.whitepages.com/suppression-requests', difficulty: 'easy', estimatedTime: '24 hours' },
  { id: 'beenverified', name: 'BeenVerified', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Social Media'], optOutUrl: 'https://www.beenverified.com/app/optout/search', difficulty: 'medium', estimatedTime: '1-3 days' },
  { id: 'intelius', name: 'Intelius', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'], optOutUrl: 'https://www.intelius.com/opt-out', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'radaris', name: 'Radaris', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Social Media'], optOutUrl: 'https://radaris.com/page/how-to-remove', difficulty: 'medium', estimatedTime: '2-4 days' },
  { id: 'peoplefinder', name: 'PeopleFinder', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Age', 'Relatives'], optOutUrl: 'https://www.peoplefinders.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'instantcheckmate', name: 'Instant Checkmate', category: 'People Search', dataCollected: ['Criminal Records', 'Address', 'Phone', 'Social Media'], optOutUrl: 'https://www.instantcheckmate.com/opt-out/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'truthfinder', name: 'TruthFinder', category: 'People Search', dataCollected: ['Criminal Records', 'Address', 'Social Media', 'Photos'], optOutUrl: 'https://www.truthfinder.com/opt-out/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'familytreenow', name: 'FamilyTreeNow', category: 'People Search', dataCollected: ['Name', 'Address', 'Relatives', 'Age'], optOutUrl: 'https://www.familytreenow.com/optout', difficulty: 'easy', estimatedTime: '24 hours' },
  { id: 'peekyou', name: 'PeekYou', category: 'People Search', dataCollected: ['Name', 'Social Media', 'Email', 'Username'], optOutUrl: 'https://www.peekyou.com/about/contact/optout/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'pipl', name: 'Pipl', category: 'People Search', dataCollected: ['Name', 'Email', 'Social Media', 'Phone'], optOutUrl: 'https://pipl.com/personal-information-removal-request/', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'mylife', name: 'MyLife', category: 'People Search', dataCollected: ['Name', 'Address', 'Reputation Score', 'Reviews'], optOutUrl: 'https://www.mylife.com/ccpa/index.pubview', difficulty: 'hard', estimatedTime: '5-7 days' },
  { id: 'usphonebook', name: 'US Phone Book', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.usphonebook.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'zabasearch', name: 'ZabaSearch', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Age'], optOutUrl: 'https://www.zabasearch.com/block_records/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'peoplesmart', name: 'PeopleSmart', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.peoplesmart.com/optout-go', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'anywho', name: 'AnyWho', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.anywho.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'publicrecordsnow', name: 'Public Records Now', category: 'People Search', dataCollected: ['Criminal Records', 'Address', 'Phone'], optOutUrl: 'https://www.publicrecordsnow.com/static/view/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'backgroundalert', name: 'Background Alert', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.backgroundalert.com/optout/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'fastpeoplesearch', name: 'Fast People Search', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.fastpeoplesearch.com/removal', difficulty: 'easy', estimatedTime: '24 hours' },
  { id: 'gladiknow', name: 'Glad I Know', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://gladiknow.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'idtrue', name: 'IDTrue', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'], optOutUrl: 'https://www.idtrue.com/optout/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'infotracer', name: 'InfoTracer', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Social Media'], optOutUrl: 'https://infotracer.com/optout/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'locateplus', name: 'LocatePlus', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Social Security'], optOutUrl: 'https://www.locateplus.com/privacy/', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'nuwber', name: 'Nuwber', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Age'], optOutUrl: 'https://nuwber.com/removal/link', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'officialusa', name: 'OfficialUSA', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Public Records'], optOutUrl: 'https://www.officialusa.com/optout/', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'peoplefindfast', name: 'People Find Fast', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://peoplefindfast.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'peoplelooker', name: 'PeopleLooker', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'], optOutUrl: 'https://www.peoplelooker.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'persopo', name: 'Persopo', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://persopo.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'privaterecords', name: 'Private Records', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'], optOutUrl: 'https://www.privaterecords.net/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'propeoplesearch', name: 'Pro People Search', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.propeoplesearch.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'quickpeopletrace', name: 'Quick People Trace', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.quickpeopletrace.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'rehold', name: 'Rehold', category: 'People Search', dataCollected: ['Property Records', 'Address', 'Owner Data'], optOutUrl: 'https://rehold.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'reversephonecheck', name: 'Reverse Phone Check', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.reversephonecheck.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'searchpeoplefree', name: 'Search People Free', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.searchpeoplefree.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'smartbackgroundchecks', name: 'Smart Background Checks', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.smartbackgroundchecks.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'spyfly', name: 'SpyFly', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'], optOutUrl: 'https://www.spyfly.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'staterecords', name: 'State Records', category: 'People Search', dataCollected: ['Criminal Records', 'Address', 'Phone'], optOutUrl: 'https://staterecords.org/opt-out.php', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'thatsthem', name: 'ThatsThem', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Social Media'], optOutUrl: 'https://thatsthem.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'truepeoplesearch', name: 'True People Search', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Relatives'], optOutUrl: 'https://www.truepeoplesearch.com/removal', difficulty: 'easy', estimatedTime: '24 hours' },
  { id: 'verecor', name: 'Verecor', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://verecor.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'veripages', name: 'VeriPages', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Age'], optOutUrl: 'https://veripages.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'voterrecords', name: 'Voter Records', category: 'People Search', dataCollected: ['Name', 'Address', 'Voting History', 'Political Affiliation'], optOutUrl: 'https://voterrecords.com/optout', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'xlek', name: 'Xlek', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://xlek.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'yellowpages', name: 'Yellow Pages', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Business Listings'], optOutUrl: 'https://www.yellowpages.com/about/privacy', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: '411', name: '411.com', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.411.com/privacy', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'addresssearch', name: 'AddressSearch', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.addresssearch.com/opt-out.php', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'advancedbackgroundchecks', name: 'Advanced Background Checks', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.advancedbackgroundchecks.com/removal', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'americaphonebook', name: 'AmericaPhoneBook', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.americaphonebook.com/opt-out.php', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'archives', name: 'Archives.com', category: 'People Search', dataCollected: ['Name', 'Address', 'Historical Records', 'Relatives'], optOutUrl: 'https://www.archives.com/privacy', difficulty: 'medium', estimatedTime: '3-5 days' },
  { id: 'arrestfacts', name: 'ArrestFacts', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records'], optOutUrl: 'https://arrestfacts.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'backgroundcheckers', name: 'BackgroundCheckers', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.backgroundcheckers.net/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'checkpeople', name: 'CheckPeople', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.checkpeople.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'clustrmaps', name: 'ClustrMaps', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Neighbors'], optOutUrl: 'https://clustrmaps.com/bl/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'cocofinder', name: 'CocoFinder', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://cocofinder.com/remove-my-info', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'cyberbackgroundchecks', name: 'Cyber Background Checks', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.cyberbackgroundchecks.com/removal', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'dataveria', name: 'Dataveria', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://dataveria.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'easybackgroundchecks', name: 'EasyBackgroundChecks', category: 'People Search', dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'], optOutUrl: 'https://www.easybackgroundchecks.com/removal', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'findpeoplesearch', name: 'FindPeopleSearch', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://www.findpeoplesearch.com/opt-out', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'freepeopledirectory', name: 'FreePeopleDirectory', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone'], optOutUrl: 'https://www.freepeopledirectory.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'homemetry', name: 'Homemetry', category: 'People Search', dataCollected: ['Name', 'Address', 'Property Records', 'Neighbors'], optOutUrl: 'https://homemetry.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'houseforyou', name: 'HouseForYou', category: 'People Search', dataCollected: ['Name', 'Address', 'Property Records'], optOutUrl: 'https://houseforyou.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'kiwisearches', name: 'Kiwi Searches', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Email'], optOutUrl: 'https://kiwisearches.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'neighborwho', name: 'NeighborWho', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Property Records'], optOutUrl: 'https://neighborwho.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
  { id: 'newenglandfacts', name: 'NewEnglandFacts', category: 'People Search', dataCollected: ['Name', 'Address', 'Phone', 'Public Records'], optOutUrl: 'https://newenglandfacts.com/optout', difficulty: 'easy', estimatedTime: '24-48 hours' },
]
const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case 'easy': return '[ EASY ]'
    case 'medium': return '[ MEDIUM ]'
    case 'hard': return '[ HARD ]'
    default: return '[ UNKNOWN ]'
  }
}

export default function DataBrokers({ onRemovalSent }) {
  const [completed, setCompleted] = useState([])
  const [pendingBrokers, setPendingBrokers] = useState([])
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authComplete, setAuthComplete] = useState(false)
  const [dashboardKey, setDashboardKey] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('authorization_signed')
          .eq('id', data.user.id)
          .single()
        setAuthComplete(profile?.authorization_signed || false)
        await fetchCompleted(data.user.id)
        await fetchPendingRemovals(data.user.id)
      }
      setLoading(false)
    })
  }, [])

  const fetchCompleted = async (userId) => {
    const { data } = await supabase
      .from('broker_removals').select('broker_id').eq('user_id', userId)
    if (data) setCompleted(data.map(d => d.broker_id))
  }

  const fetchPendingRemovals = async (userId) => {
    const { data } = await supabase
      .from('removal_attempts')
      .select('broker_id, status, sent_at')
      .eq('user_id', userId)
      .in('status', ['sent', 'delivered', 'pending'])
      .order('sent_at', { ascending: false })
    if (data) {
      const uniqueBrokerIds = [...new Set(data.map(d => d.broker_id))]
      setPendingBrokers(uniqueBrokerIds)
    }
  }

  const toggleCompleted = async (brokerId) => {
    if (!user) return
    if (completed.includes(brokerId)) {
      await supabase.from('broker_removals').delete()
        .eq('user_id', user.id).eq('broker_id', brokerId)
      setCompleted(completed.filter(id => id !== brokerId))
    } else {
      await supabase.from('broker_removals').insert({ user_id: user.id, broker_id: brokerId })
      setCompleted([...completed, brokerId])
    }
  }

  const getStatus = (brokerId) => {
    if (completed.includes(brokerId)) return 'done'
    if (pendingBrokers.includes(brokerId)) return 'pending'
    return 'none'
  }

  const handledCount = new Set([...completed, ...pendingBrokers]).size
  const categories = ['all', ...new Set(BROKERS.map(b => b.category))]
  const filteredBrokers = filter === 'all' ? BROKERS : BROKERS.filter(b => b.category === filter)
  const completionPercentage = Math.round((handledCount / BROKERS.length) * 100)

  if (loading) return (
    <div className="auth-container">
      <p style={{ color: '#888', fontFamily: "'Share Tech Mono', monospace" }}>Loading...</p>
    </div>
  )

  return (
    <div className="tool-container" style={{ maxWidth: '900px' }}>
      <div className="tool-header">
        <TypewriterText text="Data Broker Removal" style={{ fontFamily: "'Share Tech Mono', monospace" }} />
        <p className="tool-sub">Remove yourself from sites that sell your <Redacted>personal data</Redacted></p>
      </div>

      {!authComplete && (
        <AuthorizationForm onComplete={() => setAuthComplete(true)} />
      )}

      {authComplete && (
        <>
          <RemovalDashboard key={dashboardKey} />
          <AutoRemoval onRemovalSent={() => {
            if (user) {
              fetchPendingRemovals(user.id)
              fetchCompleted(user.id)
            }
            setDashboardKey(k => k + 1)
            if (onRemovalSent) onRemovalSent()
          }} />
        </>
      )}

      <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid #1a1a1a', padding: '30px', marginBottom: '25px', marginTop: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '5px', fontFamily: "'Share Tech Mono', monospace", color: '#fff' }}>
              Removal Progress
            </h3>
            <p style={{ color: '#444', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
              {handledCount} of {BROKERS.length} brokers addressed
            </p>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: "'Share Tech Mono', monospace" }}>
            {completionPercentage}%
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.6)', height: '4px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ height: '100%', width: `${completionPercentage}%`, background: '#fff', transition: 'width 0.5s ease' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Removed', value: completed.length, color: '#fff' },
            { label: 'Pending', value: pendingBrokers.filter(id => !completed.includes(id)).length, color: '#666' },
            { label: 'Remaining', value: BROKERS.length - handledCount, color: '#fff' },
            { label: 'Total', value: BROKERS.length, color: '#fff' },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: 'rgba(0, 0, 0, 0.6)', border: '1px solid #1a1a1a', padding: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: stat.color, marginBottom: '4px', fontFamily: "'Share Tech Mono', monospace" }}>
                {stat.value}
              </div>
              <div style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Share Tech Mono', monospace" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{ background: filter === cat ? '#fff' : 'transparent', border: '1px solid #333', color: filter === cat ? '#000' : '#555', padding: '6px 14px', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'capitalize', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredBrokers.map(broker => {
          const status = getStatus(broker.id)
          const isDone = status === 'done'
          const isPending = status === 'pending'

          return (
            <div
              key={broker.id}
              style={{ background: isDone ? '#050505' : isPending ? '#0a0a0a' : '#000', border: `1px solid ${isPending ? '#222' : '#1a1a1a'}`, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', transition: 'all 0.2s' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontFamily: "'Share Tech Mono', monospace", color: isDone ? '#444' : isPending ? '#888' : '#fff' }}>
                    {broker.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
                    {broker.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
                    {getDifficultyLabel(broker.difficulty)}
                  </span>
                  {isPending && (
                    <span style={{ fontSize: '0.65rem', color: '#666', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', border: '1px solid #333', padding: '2px 8px' }}>
                      OPT-OUT SENT
                    </span>
                  )}
                  {isDone && (
                    <span style={{ fontSize: '0.65rem', color: '#444', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', border: '1px solid #222', padding: '2px 8px' }}>
                      REMOVED
                    </span>
                  )}
                </div>
                <div style={{ color: '#333', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", marginBottom: '3px' }}>
                  {broker.dataCollected.join(', ')}
                </div>
                <div style={{ color: '#2a2a2a', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
                  Removal time: {broker.estimatedTime}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                {!isDone && (
                  <a
                    href={broker.optOutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '7px 14px', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}
                  >
                    Opt Out
                  </a>
                )}
                <button
                  onClick={() => toggleCompleted(broker.id)}
                  style={{
                    background: isDone ? '#111' : 'transparent',
                    border: '1px solid #333',
                    color: isDone ? '#fff' : '#444',
                    padding: '7px 14px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: '1px',
                    transition: 'all 0.2s'
                  }}
                >
                  {isDone ? 'Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#000', border: '1px solid #1a1a1a', textAlign: 'center', color: '#333', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
        Brokers may re-add your <Redacted>data</Redacted> over time.
        Your <Redacted>data</Redacted> is automatically re-removed every 30 days.
      </div>
    </div>
  )
}