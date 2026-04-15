import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AutoRemoval from '../components/AutoRemoval'

const BROKERS = [
  {
    id: 'spokeo',
    name: 'Spokeo',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Relatives'],
    optOutUrl: 'https://www.spokeo.com/optout',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📋'
  },
  {
    id: 'whitepages',
    name: 'WhitePages',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Age'],
    optOutUrl: 'https://www.whitepages.com/suppression-requests',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '📞'
  },
  {
    id: 'beenverified',
    name: 'BeenVerified',
    category: 'Background Check',
    dataCollected: ['Name', 'Address', 'Criminal Records', 'Social Media'],
    optOutUrl: 'https://www.beenverified.com/app/optout/search',
    difficulty: 'medium',
    estimatedTime: '1-3 days',
    icon: '🔎'
  },
  {
    id: 'intelius',
    name: 'Intelius',
    category: 'Background Check',
    dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
    optOutUrl: 'https://www.intelius.com/opt-out',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🔍'
  },
  {
    id: 'mylife',
    name: 'MyLife',
    category: 'Reputation',
    dataCollected: ['Name', 'Address', 'Reputation Score', 'Reviews'],
    optOutUrl: 'https://www.mylife.com/ccpa/index.pubview',
    difficulty: 'hard',
    estimatedTime: '5-7 days',
    icon: '👤'
  },
  {
    id: 'radaris',
    name: 'Radaris',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Social Media'],
    optOutUrl: 'https://radaris.com/page/how-to-remove',
    difficulty: 'medium',
    estimatedTime: '2-4 days',
    icon: '📡'
  },
  {
    id: 'peoplefinder',
    name: 'PeopleFinder',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Age', 'Relatives'],
    optOutUrl: 'https://www.peoplefinders.com/opt-out',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '🔭'
  },
  {
    id: 'instantcheckmate',
    name: 'Instant Checkmate',
    category: 'Background Check',
    dataCollected: ['Criminal Records', 'Address', 'Phone', 'Social Media'],
    optOutUrl: 'https://www.instantcheckmate.com/opt-out/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '✅'
  },
  {
    id: 'truthfinder',
    name: 'TruthFinder',
    category: 'Background Check',
    dataCollected: ['Criminal Records', 'Address', 'Social Media', 'Photos'],
    optOutUrl: 'https://www.truthfinder.com/opt-out/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '🔬'
  },
  {
    id: 'acxiom',
    name: 'Acxiom',
    category: 'Data Broker',
    dataCollected: ['Purchase History', 'Demographics', 'Financial Data'],
    optOutUrl: 'https://www.acxiom.com/optout/',
    difficulty: 'medium',
    estimatedTime: '30 days',
    icon: '🏢'
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    category: 'Data Broker',
    dataCollected: ['Purchase History', 'Email', 'Demographics'],
    optOutUrl: 'https://www.epsilon.com/us/privacy-policy/privacy-request',
    difficulty: 'medium',
    estimatedTime: '30 days',
    icon: '📊'
  },
  {
    id: 'lexisnexis',
    name: 'LexisNexis',
    category: 'Data Broker',
    dataCollected: ['Legal Records', 'Financial', 'Address History'],
    optOutUrl: 'https://optout.lexisnexis.com/',
    difficulty: 'hard',
    estimatedTime: '30 days',
    icon: '⚖️'
  },
  {
    id: 'coredatabroker',
    name: 'CoreLogic',
    category: 'Data Broker',
    dataCollected: ['Property Records', 'Financial', 'Address History'],
    optOutUrl: 'https://www.corelogic.com/privacy-center/',
    difficulty: 'hard',
    estimatedTime: '30 days',
    icon: '🏠'
  },
  {
    id: 'familytreenow',
    name: 'FamilyTreeNow',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Relatives', 'Age'],
    optOutUrl: 'https://www.familytreenow.com/optout',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '🌳'
  },
  {
    id: 'usphonebook',
    name: 'US Phone Book',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone'],
    optOutUrl: 'https://www.usphonebook.com/opt-out',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📱'
  },
  {
    id: 'peekyou',
    name: 'PeekYou',
    category: 'People Search',
    dataCollected: ['Name', 'Social Media', 'Email', 'Username'],
    optOutUrl: 'https://www.peekyou.com/about/contact/optout/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '👀'
  },
  {
    id: 'pipl',
    name: 'Pipl',
    category: 'People Search',
    dataCollected: ['Name', 'Email', 'Social Media', 'Phone'],
    optOutUrl: 'https://pipl.com/personal-information-removal-request/',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🔮'
  },
  {
    id: 'truepeoplesearch',
    name: 'True People Search',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Relatives'],
    optOutUrl: 'https://www.truepeoplesearch.com/removal',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '👥'
  },
  {
    id: 'fastpeoplesearch',
    name: 'Fast People Search',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email'],
    optOutUrl: 'https://www.fastpeoplesearch.com/removal',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '⚡'
  },
  {
    id: 'thatsthem',
    name: 'ThatsThem',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Social Media'],
    optOutUrl: 'https://thatsthem.com/optout',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '🎯'
  },
  {
    id: 'nuwber',
    name: 'Nuwber',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Age'],
    optOutUrl: 'https://nuwber.com/removal/link',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📊'
  },
  {
    id: 'zoominfo',
    name: 'ZoomInfo',
    category: 'Data Broker',
    dataCollected: ['Name', 'Email', 'Phone', 'Company', 'Job Title'],
    optOutUrl: 'https://www.zoominfo.com/about/privacy/privacy-controls',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🔍'
  },
  {
    id: 'publicrecordsnow',
    name: 'Public Records Now',
    category: 'Public Records',
    dataCollected: ['Criminal Records', 'Address', 'Phone'],
    optOutUrl: 'https://www.publicrecordsnow.com/static/view/optout',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📁'
  },
  {
    id: 'arrests',
    name: 'Arrests.org',
    category: 'Public Records',
    dataCollected: ['Arrest Records', 'Mugshots', 'Name'],
    optOutUrl: 'https://arrests.org/removal/',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🚨'
  },
  {
  id: 'equifax',
  name: 'Equifax',
  category: 'Data Broker',
  dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'],
  optOutUrl: 'https://www.equifax.com/personal/privacy/',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '💳'
},
{
  id: 'experian',
  name: 'Experian',
  category: 'Data Broker',
  dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'],
  optOutUrl: 'https://www.experian.com/privacy/center.html',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '💳'
},
{
  id: 'transunion',
  name: 'TransUnion',
  category: 'Data Broker',
  dataCollected: ['Credit History', 'Financial Data', 'Address', 'Employment'],
  optOutUrl: 'https://www.transunion.com/legal/privacy-center',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '💳'
},
{
  id: 'oracle',
  name: 'Oracle Data Cloud',
  category: 'Data Broker',
  dataCollected: ['Purchase History', 'Location', 'Demographics', 'Behavior'],
  optOutUrl: 'https://datacloudoptout.oracle.com/optout',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '☁️'
},
{
  id: 'corelogic',
  name: 'CoreLogic',
  category: 'Data Broker',
  dataCollected: ['Property Records', 'Financial', 'Address History'],
  optOutUrl: 'https://www.corelogic.com/privacy-center/',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '🏠'
},
{
  id: 'verisk',
  name: 'Verisk',
  category: 'Data Broker',
  dataCollected: ['Insurance Data', 'Financial', 'Property Records'],
  optOutUrl: 'https://www.verisk.com/privacy/',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '📈'
},
{
  id: 'thomsonreuters',
  name: 'Thomson Reuters',
  category: 'Data Broker',
  dataCollected: ['Legal Records', 'Financial', 'Professional Data'],
  optOutUrl: 'https://www.thomsonreuters.com/en/privacy-statement.html',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '📰'
},
{
  id: 'nielsen',
  name: 'Nielsen',
  category: 'Data Broker',
  dataCollected: ['Media Consumption', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.nielsen.com/us/en/legal/privacy-statement/nielsen-us-opt-out/',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '📺'
},
{
  id: 'comscore',
  name: 'comScore',
  category: 'Data Broker',
  dataCollected: ['Browsing History', 'Demographics', 'Media Consumption'],
  optOutUrl: 'https://www.comscore.com/About/Privacy-Policy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '📊'
},
{
  id: 'neustar',
  name: 'Neustar',
  category: 'Data Broker',
  dataCollected: ['Phone Data', 'Demographics', 'Location'],
  optOutUrl: 'https://www.home.neustar/privacy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '📡'
},
{
  id: 'liveramp',
  name: 'LiveRamp',
  category: 'Data Broker',
  dataCollected: ['Identity Data', 'Purchase History', 'Demographics'],
  optOutUrl: 'https://liveramp.com/opt_out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🔗'
},
{
  id: 'lotame',
  name: 'Lotame',
  category: 'Data Broker',
  dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'],
  optOutUrl: 'https://www.lotame.com/about-lotame/privacy/lotames-products-privacy-policy/opt-out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📊'
},
{
  id: 'bluekai',
  name: 'BlueKai',
  category: 'Data Broker',
  dataCollected: ['Behavioral Data', 'Purchase Intent', 'Demographics'],
  optOutUrl: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '🔵'
},
{
  id: 'mediamath',
  name: 'MediaMath',
  category: 'Data Broker',
  dataCollected: ['Behavioral Data', 'Demographics', 'Ad Targeting Data'],
  optOutUrl: 'https://www.mediamath.com/privacy-policy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📐'
},
{
  id: 'quantcast',
  name: 'Quantcast',
  category: 'Data Broker',
  dataCollected: ['Browsing History', 'Demographics', 'Interest Profiles'],
  optOutUrl: 'https://www.quantcast.com/opt-out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📉'
},
{
  id: 'tapad',
  name: 'Tapad',
  category: 'Data Broker',
  dataCollected: ['Device Data', 'Behavioral Data', 'Demographics'],
  optOutUrl: 'https://www.tapad.com/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📱'
},
{
  id: 'iqvia',
  name: 'IQVIA',
  category: 'Data Broker',
  dataCollected: ['Health Data', 'Prescription Data', 'Demographics'],
  optOutUrl: 'https://www.iqvia.com/about-us/privacy/individual-rights-request',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '💊'
},
{
  id: 'alliant',
  name: 'Alliant',
  category: 'Data Broker',
  dataCollected: ['Purchase History', 'Financial Data', 'Demographics'],
  optOutUrl: 'https://www.alliantdata.com/privacy-policy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📋'
},
{
  id: 'cardlytics',
  name: 'Cardlytics',
  category: 'Data Broker',
  dataCollected: ['Purchase History', 'Financial Data', 'Demographics'],
  optOutUrl: 'https://www.cardlytics.com/consumer-opt-out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '💳'
},
{
  id: 'datalogix',
  name: 'Datalogix',
  category: 'Data Broker',
  dataCollected: ['Purchase History', 'Demographics', 'Location'],
  optOutUrl: 'https://www.oracle.com/legal/privacy/privacy-policy.html',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📊'
},
{
  id: 'crossix',
  name: 'Crossix',
  category: 'Data Broker',
  dataCollected: ['Health Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.crossix.com/privacy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '🏥'
},
{
  id: 'drawbridge',
  name: 'Drawbridge',
  category: 'Data Broker',
  dataCollected: ['Device Data', 'Behavioral Data', 'Demographics'],
  optOutUrl: 'https://drawbridge.com/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🌉'
},
{
  id: 'zabasearch',
  name: 'ZabaSearch',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Age'],
  optOutUrl: 'https://www.zabasearch.com/block_records/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔍'
},
{
  id: 'peoplesmart',
  name: 'PeopleSmart',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.peoplesmart.com/optout-go',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '👤'
},
{
  id: 'anywho',
  name: 'AnyWho',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://www.anywho.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '📞'
},
{
  id: 'backgroundalert',
  name: 'Background Alert',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'],
  optOutUrl: 'https://www.backgroundalert.com/optout/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🚨'
},
{
  id: 'clustrmaps',
  name: 'ClustrMaps',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Location Data'],
  optOutUrl: 'https://clustrmaps.com/bl/opt-out',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🗺️'
},
{
  id: 'dataveria',
  name: 'Dataveria',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://dataveria.com/ng/control/privacy',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '📋'
},
{
  id: 'dobsearch',
  name: 'DOBSearch',
  category: 'People Search',
  dataCollected: ['Name', 'Date of Birth', 'Address', 'Phone'],
  optOutUrl: 'https://www.dobsearch.com/people-finder/pf_optout.php',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🎂'
},
{
  id: 'gladiknow',
  name: 'Glad I Know',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.gladiknow.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '👋'
},
{
  id: 'idtrue',
  name: 'IDTrue',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
  optOutUrl: 'https://www.idtrue.com/optout/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🪪'
},
{
  id: 'infotracer',
  name: 'InfoTracer',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Social Media'],
  optOutUrl: 'https://infotracer.com/optout/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔎'
},
{
  id: 'iverify',
  name: 'iVerify',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://iverify.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '✅'
},
{
  id: 'locateplus',
  name: 'LocatePlus',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
  optOutUrl: 'https://locateplus.com/optout',
  difficulty: 'medium',
  estimatedTime: '3-5 days',
  icon: '📍'
},
{
  id: 'officialusa',
  name: 'OfficialUSA',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://www.officialusa.com/optout/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🇺🇸'
},
{
  id: 'peoplefindfast',
  name: 'People Find Fast',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.peoplefindfast.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '⚡'
},
{
  id: 'peoplelooker',
  name: 'PeopleLooker',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
  optOutUrl: 'https://www.peoplelooker.com/opt-out',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔭'
},
{
  id: 'persopo',
  name: 'Persopo',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.persopo.com/opt-out.html',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '👤'
},
{
  id: 'privaterecords',
  name: 'Private Records',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'],
  optOutUrl: 'https://www.privaterecords.net/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔒'
},
{
  id: 'propeoplesearch',
  name: 'Pro People Search',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.propeoplesearch.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔍'
},
{
  id: 'quickpeopletrace',
  name: 'Quick People Trace',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://www.quickpeopletrace.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '⚡'
},
{
  id: 'rehold',
  name: 'Rehold',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://rehold.com/privacy',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🏠'
},
{
  id: 'reversephonecheck',
  name: 'Reverse Phone Check',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://www.reversephonecheck.com/opt-out/',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '📞'
},
{
  id: 'searchpeoplefree',
  name: 'Search People Free',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://www.searchpeoplefree.com/opt-out',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔍'
},
{
  id: 'smartbackgroundchecks',
  name: 'Smart Background Checks',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Criminal Records', 'Phone'],
  optOutUrl: 'https://www.smartbackgroundchecks.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '✅'
},
{
  id: 'spyfly',
  name: 'SpyFly',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
  optOutUrl: 'https://www.spyfly.com/help-center/remove-information',
  difficulty: 'medium',
  estimatedTime: '3-5 days',
  icon: '🕵️'
},
{
  id: 'staterecords',
  name: 'State Records',
  category: 'People Search',
  dataCollected: ['Criminal Records', 'Address', 'Phone'],
  optOutUrl: 'https://staterecords.org/opt-out.php',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🏛️'
},
{
  id: 'verecor',
  name: 'Verecor',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://verecor.com/ng/control/privacy',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '✔️'
},
{
  id: 'veripages',
  name: 'VeriPages',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone'],
  optOutUrl: 'https://veripages.com/page/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '📄'
},
{
  id: 'voterrecords',
  name: 'Voter Records',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Voting History', 'Political Affiliation'],
  optOutUrl: 'https://voterrecords.com/optout',
  difficulty: 'medium',
  estimatedTime: '3-5 days',
  icon: '🗳️'
},
{
  id: 'xlek',
  name: 'Xlek',
  category: 'People Search',
  dataCollected: ['Name', 'Address', 'Phone', 'Email'],
  optOutUrl: 'https://xlek.com/optout',
  difficulty: 'easy',
  estimatedTime: '24-48 hours',
  icon: '🔍'
},
{
  id: 'harte-hanks',
  name: 'Harte-Hanks',
  category: 'Marketing',
  dataCollected: ['Purchase History', 'Demographics', 'Behavioral Data'],
  optOutUrl: 'https://www.harte-hanks.com/privacy-policy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📬'
},
{
  id: 'merkle',
  name: 'Merkle',
  category: 'Marketing',
  dataCollected: ['Purchase History', 'Demographics', 'Behavioral Data'],
  optOutUrl: 'https://www.merkleinc.com/privacy-policy',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📊'
},
{
  id: 'conversant',
  name: 'Conversant',
  category: 'Marketing',
  dataCollected: ['Purchase History', 'Behavioral Data', 'Demographics'],
  optOutUrl: 'https://www.conversantmedia.com/legal/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '💬'
},
{
  id: 'dataxu',
  name: 'DataXu',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Ad Targeting Data'],
  optOutUrl: 'https://www.dataxu.com/privacy-policy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📈'
},
{
  id: 'dun-bradstreet',
  name: 'Dun and Bradstreet',
  category: 'Marketing',
  dataCollected: ['Business Data', 'Financial Data', 'Professional Data'],
  optOutUrl: 'https://www.dnb.com/utility-pages/ccpa-dns.html',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '🏢'
},
{
  id: 'inmarket',
  name: 'InMarket',
  category: 'Marketing',
  dataCollected: ['Location Data', 'Purchase History', 'Behavioral Data'],
  optOutUrl: 'https://inmarket.com/ccpa-opt-out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🛒'
},
{
  id: 'kochava',
  name: 'Kochava',
  category: 'Marketing',
  dataCollected: ['Device Data', 'Location', 'App Usage'],
  optOutUrl: 'https://www.kochava.com/support-privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📱'
},
{
  id: 'placed',
  name: 'Placed',
  category: 'Marketing',
  dataCollected: ['Location Data', 'Behavioral Data', 'Demographics'],
  optOutUrl: 'https://www.placed.com/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📍'
},
{
  id: 'salesforce-dmp',
  name: 'Salesforce DMP',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.salesforce.com/company/privacy/full_privacy/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '☁️'
},
{
  id: 'semcasting',
  name: 'Semcasting',
  category: 'Marketing',
  dataCollected: ['Demographics', 'Location', 'Purchase History'],
  optOutUrl: 'https://semcasting.com/optout/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📡'
},
{
  id: 'sharethrough',
  name: 'Sharethrough',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Ad Data'],
  optOutUrl: 'https://www.sharethrough.com/privacy-center/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📢'
},
{
  id: 'stirista',
  name: 'Stirista',
  category: 'Marketing',
  dataCollected: ['Email Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.stirista.com/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📧'
},
{
  id: 'taboola',
  name: 'Taboola',
  category: 'Marketing',
  dataCollected: ['Browsing History', 'Behavioral Data', 'Demographics'],
  optOutUrl: 'https://www.taboola.com/privacy-policy#optout',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📰'
},
{
  id: 'throtle',
  name: 'Throtle',
  category: 'Marketing',
  dataCollected: ['Identity Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://throtle.io/privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🎯'
},
{
  id: 'towerdata',
  name: 'TowerData',
  category: 'Marketing',
  dataCollected: ['Email Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.towerdata.com/privacy-policy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🗼'
},
{
  id: 'tradedesk',
  name: 'The Trade Desk',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Ad Targeting'],
  optOutUrl: 'https://www.thetradedesk.com/us/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '💹'
},
{
  id: 'truoptik',
  name: 'TruOptik',
  category: 'Marketing',
  dataCollected: ['Streaming Data', 'Demographics', 'Behavioral Data'],
  optOutUrl: 'https://truoptik.com/privacy-policy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📺'
},
{
  id: 'twilio',
  name: 'Twilio Segment',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Purchase History'],
  optOutUrl: 'https://www.twilio.com/legal/privacy',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '💬'
},
{
  id: 'viant',
  name: 'Viant',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Location'],
  optOutUrl: 'https://www.viantinc.com/privacy-policy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📊'
},
{
  id: 'weborama',
  name: 'Weborama',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'],
  optOutUrl: 'https://weborama.com/privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🌐'
},
{
  id: 'windfall',
  name: 'Windfall',
  category: 'Marketing',
  dataCollected: ['Financial Data', 'Demographics', 'Wealth Estimates'],
  optOutUrl: 'https://www.windfall.com/privacy-policy',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '💰'
},
{
  id: 'xandr',
  name: 'Xandr',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Ad Targeting'],
  optOutUrl: 'https://www.xandr.com/privacy/platform-privacy-policy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📡'
},
{
  id: 'yodlee',
  name: 'Yodlee',
  category: 'Marketing',
  dataCollected: ['Financial Data', 'Purchase History', 'Banking Data'],
  optOutUrl: 'https://www.yodlee.com/legal/yodlee-privacy-policy',
  difficulty: 'hard',
  estimatedTime: '30 days',
  icon: '🏦'
},
{
  id: 'addthis',
  name: 'AddThis',
  category: 'Marketing',
  dataCollected: ['Browsing History', 'Social Sharing Data', 'Demographics'],
  optOutUrl: 'https://www.addthis.com/privacy/opt-out/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '➕'
},
{
  id: 'adsquare',
  name: 'Adsquare',
  category: 'Marketing',
  dataCollected: ['Location Data', 'Demographics', 'Behavioral Data'],
  optOutUrl: 'https://www.adsquare.com/privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📍'
},
{
  id: 'exelate',
  name: 'eXelate',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'],
  optOutUrl: 'https://exelate.com/privacy/optout-form/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📊'
},
{
  id: 'krux',
  name: 'Krux Digital',
  category: 'Marketing',
  dataCollected: ['Behavioral Data', 'Demographics', 'Interest Profiles'],
  optOutUrl: 'https://krux.com/privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🔵'
},
{
  id: 'google',
  name: 'Google',
  category: 'Big Tech',
  dataCollected: ['Search History', 'Location', 'Gmail', 'YouTube', 'Health Data'],
  optOutUrl: 'https://myaccount.google.com/data-and-privacy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '🔍'
},
{
  id: 'meta',
  name: 'Meta / Facebook',
  category: 'Big Tech',
  dataCollected: ['Posts', 'Messages', 'Location', 'Facial Recognition', 'Political Views'],
  optOutUrl: 'https://www.facebook.com/privacy/center',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '👥'
},
{
  id: 'amazon',
  name: 'Amazon',
  category: 'Big Tech',
  dataCollected: ['Purchase History', 'Alexa Recordings', 'Financial Data', 'Ring footage'],
  optOutUrl: 'https://www.amazon.com/privacy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '📦'
},
{
  id: 'microsoft',
  name: 'Microsoft',
  category: 'Big Tech',
  dataCollected: ['Documents', 'Emails', 'LinkedIn Data', 'Gaming Data', 'Keystrokes'],
  optOutUrl: 'https://account.microsoft.com/privacy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '💻'
},
{
  id: 'apple',
  name: 'Apple',
  category: 'Big Tech',
  dataCollected: ['Location', 'Health Data', 'Face ID', 'Siri Recordings', 'Purchase History'],
  optOutUrl: 'https://privacy.apple.com',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🍎'
},
{
  id: 'twitter',
  name: 'Twitter / X',
  category: 'Big Tech',
  dataCollected: ['Tweets', 'DMs', 'Political Views', 'Location', 'Phone Number'],
  optOutUrl: 'https://twitter.com/settings/privacy_and_safety',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🐦'
},
{
  id: 'tiktok',
  name: 'TikTok',
  category: 'Big Tech',
  dataCollected: ['Biometrics', 'Location', 'Clipboard', 'Contacts', 'Keystroke Patterns'],
  optOutUrl: 'https://www.tiktok.com/legal/privacy-policy',
  difficulty: 'medium',
  estimatedTime: '30 days',
  icon: '🎵'
},
{
  id: 'spotify',
  name: 'Spotify',
  category: 'Big Tech',
  dataCollected: ['Listening History', 'Location', 'Emotional State', 'Demographics'],
  optOutUrl: 'https://www.spotify.com/account/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🎧'
},
{
  id: 'linkedin',
  name: 'LinkedIn',
  category: 'Big Tech',
  dataCollected: ['Work History', 'Salary Data', 'Professional Network', 'Job Searches'],
  optOutUrl: 'https://www.linkedin.com/psettings/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '💼'
},
{
  id: 'snapchat',
  name: 'Snapchat',
  category: 'Big Tech',
  dataCollected: ['Location', 'Facial Recognition', 'Photos', 'Social Network'],
  optOutUrl: 'https://www.snapchat.com/privacy/privacy-controls',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '👻'
},
{
  id: 'netflix',
  name: 'Netflix',
  category: 'Big Tech',
  dataCollected: ['Viewing History', 'Demographics', 'Device Data', 'Payment Info'],
  optOutUrl: 'https://www.netflix.com/account/security',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🎬'
},
{
  id: 'uber',
  name: 'Uber',
  category: 'Big Tech',
  dataCollected: ['Location History', 'Payment Data', 'Trip History', 'Device Data'],
  optOutUrl: 'https://privacy.uber.com/privacy/center',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🚗'
},
{
  id: 'airbnb',
  name: 'Airbnb',
  category: 'Big Tech',
  dataCollected: ['Location', 'Payment Data', 'Identity Documents', 'Travel History'],
  optOutUrl: 'https://www.airbnb.com/help/article/2855',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🏠'
},
{
  id: 'pinterest',
  name: 'Pinterest',
  category: 'Big Tech',
  dataCollected: ['Interests', 'Browsing History', 'Demographics', 'Purchase Intent'],
  optOutUrl: 'https://www.pinterest.com/settings/privacy/',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '📌'
},
{
  id: 'reddit',
  name: 'Reddit',
  category: 'Big Tech',
  dataCollected: ['Posts', 'Comments', 'Interests', 'Political Views', 'Browsing'],
  optOutUrl: 'https://www.reddit.com/settings/privacy',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🤖'
},
{
  id: 'adobe',
  name: 'Adobe',
  category: 'Big Tech',
  dataCollected: ['Documents', 'Creative Work', 'Usage Patterns', 'Payment Data'],
  optOutUrl: 'https://www.adobe.com/privacy/opt-out.html',
  difficulty: 'easy',
  estimatedTime: '7 days',
  icon: '🎨'
},
{
  id: 'samsung',
  name: 'Samsung',
  category: 'Big Tech',
  dataCollected: ['Device Usage', 'Location', 'Health Data', 'Smart TV Viewing'],
  optOutUrl: 'https://www.samsung.com/us/account/privacy-checkup/',
  difficulty: 'medium',
  estimatedTime: '14 days',
  icon: '📱'
}
]

const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'easy': return '#4aff88'
    case 'medium': return '#ffaa00'
    case 'hard': return '#ff6b6b'
    default: return '#888'
  }
}

const getCategoryColor = (category) => {
  switch(category) {
    case 'People Search': return '#4a9eff'
    case 'Background Check': return '#ff6b6b'
    case 'Data Broker': return '#ffaa00'
    case 'Reputation': return '#ff4aff'
    case 'Public Records': return '#4affff'
    default: return '#888'
  }
}

export default function DataBrokers() {
  const [completed, setCompleted] = useState([])
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBroker, setSelectedBroker] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetchCompleted(data.user.id)
      }
    })
  }, [])

  const fetchCompleted = async (userId) => {
    const { data } = await supabase
      .from('broker_removals')
      .select('broker_id')
      .eq('user_id', userId)

    if (data) {
      setCompleted(data.map(d => d.broker_id))
    }
    setLoading(false)
  }

  const toggleCompleted = async (brokerId) => {
    if (!user) return

    if (completed.includes(brokerId)) {
      await supabase
        .from('broker_removals')
        .delete()
        .eq('user_id', user.id)
        .eq('broker_id', brokerId)
      setCompleted(completed.filter(id => id !== brokerId))
    } else {
      await supabase
        .from('broker_removals')
        .insert({
          user_id: user.id,
          broker_id: brokerId
        })
      setCompleted([...completed, brokerId])
    }
  }

  const categories = ['all', ...new Set(BROKERS.map(b => b.category))]

  const filteredBrokers = filter === 'all'
    ? BROKERS
    : BROKERS.filter(b => b.category === filter)

  const completionPercentage = Math.round(
    (completed.length / BROKERS.length) * 100
  )

  if (loading) return (
    <div className="auth-container">
      <p style={{color: '#888'}}>Loading...</p>
    </div>
  )

  return (
    <div className="tool-container" style={{maxWidth: '900px'}}>
      <div className="tool-header">
        <h1>Data Broker Removal</h1>
        <p className="tool-sub">
          Remove yourself from sites that sell your personal data
        </p>
      </div>

      {/* Auto Removal Component */}
      <AutoRemoval />

      {/* Progress Section */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{marginBottom: '5px'}}>Manual Removal Progress</h3>
            <p style={{color: '#555', fontSize: '0.85rem'}}>
              {completed.length} of {BROKERS.length} brokers removed
            </p>
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: completionPercentage > 50 ? '#4aff88' : '#ffaa00'
          }}>
            {completionPercentage}%
          </div>
        </div>

        <div style={{
          background: '#0a0a0a',
          borderRadius: '999px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${completionPercentage}%`,
            background: completionPercentage > 50 ? '#4aff88' : '#ffaa00',
            borderRadius: '999px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px'
        }}>
          {[
            {
              label: 'Removed',
              value: completed.length,
              color: '#4aff88'
            },
            {
              label: 'Remaining',
              value: BROKERS.length - completed.length,
              color: '#ff6b6b'
            },
            {
              label: 'Total',
              value: BROKERS.length,
              color: '#4a9eff'
            }
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1,
              background: '#0a0a0a',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: stat.color,
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: '#444',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? '#4a9eff' : '#111',
              border: `1px solid ${filter === cat ? '#4a9eff' : '#222'}`,
              color: filter === cat ? '#fff' : '#666',
              padding: '8px 16px',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Broker Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredBrokers.map(broker => (
          <div
            key={broker.id}
            style={{
              background: completed.includes(broker.id)
                ? '#0a1a0a'
                : '#111',
              border: `1px solid ${completed.includes(broker.id)
                ? '#1a3a1a'
                : '#1e1e1e'}`,
              borderRadius: '12px',
              padding: '20px 25px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flex: 1
            }}>
              <span style={{fontSize: '1.5rem'}}>{broker.icon}</span>
              <div style={{flex: 1}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{fontWeight: '700'}}>
                    {broker.name}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: getCategoryColor(broker.category) + '22',
                    color: getCategoryColor(broker.category),
                    border: `1px solid ${getCategoryColor(broker.category)}44`
                  }}>
                    {broker.category}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: getDifficultyColor(broker.difficulty) + '22',
                    color: getDifficultyColor(broker.difficulty),
                    border: `1px solid ${getDifficultyColor(broker.difficulty)}44`
                  }}>
                    {broker.difficulty}
                  </span>
                </div>
                <div style={{
                  color: '#444',
                  fontSize: '0.8rem',
                  marginBottom: '5px'
                }}>
                  Collects: {broker.dataCollected.join(', ')}
                </div>
                <div style={{
                  color: '#333',
                  fontSize: '0.75rem'
                }}>
                  ⏱ Removal time: {broker.estimatedTime}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {!completed.includes(broker.id) && (
                <a
                  href={broker.optOutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'transparent',
                    border: '1px solid #222',
                    color: '#888',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Opt Out →
                </a>
              )}
              <button
                onClick={() => toggleCompleted(broker.id)}
                style={{
                  background: completed.includes(broker.id)
                    ? '#0a1a0a'
                    : 'transparent',
                  border: `1px solid ${completed.includes(broker.id)
                    ? '#1a3a1a'
                    : '#222'}`,
                  color: completed.includes(broker.id)
                    ? '#4aff88'
                    : '#444',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {completed.includes(broker.id) ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#0a0f1a',
        border: '1px solid #1a2a3a',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#4a9eff',
        fontSize: '0.85rem'
      }}>
        🔄 Brokers may re-add your data over time.
        Check back monthly to stay protected.
      </div>
    </div>
  )
}