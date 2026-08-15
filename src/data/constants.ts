import { Category, Currency } from './types';

// Expense categories, grouped by theme (see theme/tokens.ts#expenseGroups for the group→color
// map). Order matches the design's fixed group order: daily, housing, health, family,
// commitments, shopping, other.
export const EXPENSE_CATS: Category[] = [
  { id: 'grocery', name: 'بقالة وسوبرماركت', icon: 'basket', group: 'daily' },
  { id: 'food', name: 'أكل بره وتوصيل', icon: 'food', group: 'daily' },
  { id: 'taxi', name: 'تكسي وكراوي', icon: 'transport', group: 'daily' },
  { id: 'transport', name: 'وقود سيارة شخصية', icon: 'fuel', group: 'daily' },
  { id: 'topup', name: 'كارتات شحن (موبايل، إنترنت)', icon: 'laptop', group: 'daily' },
  { id: 'rent', name: 'إيجار', icon: 'home', group: 'housing' },
  { id: 'bills', name: 'فواتير كهرباء وماء', icon: 'bills', group: 'housing' },
  { id: 'generator', name: 'مولدة أهلية', icon: 'bolt', group: 'housing' },
  { id: 'maintenance', name: 'صيانة المنزل', icon: 'wrench', group: 'housing' },
  { id: 'medicine', name: 'أدوية وصيدلية', icon: 'pill', group: 'health' },
  { id: 'health', name: 'عيادات ومستشفيات', icon: 'health', group: 'health' },
  { id: 'occasions', name: 'مناسبات (أعراس، عزاء، عيد)', icon: 'star', group: 'family' },
  { id: 'education', name: 'تعليم ومدارس', icon: 'cap', group: 'family' },
  { id: 'gifts', name: 'هدايا', icon: 'gift', group: 'family' },
  { id: 'debt_repay', name: 'تسديد دين', icon: 'card', group: 'commitments' },
  { id: 'installment', name: 'قسط', icon: 'card', group: 'commitments' },
  { id: 'charity_manual', name: 'صدقة', icon: 'heart', group: 'commitments' },
  { id: 'shopping', name: 'ملابس', icon: 'shopping', group: 'shopping' },
  { id: 'entertainment', name: 'ترفيه', icon: 'controller', group: 'shopping' },
  { id: 'subscriptions', name: 'اشتراكات', icon: 'repeat', group: 'shopping' },
  { id: 'other', name: 'أخرى', icon: 'tag', group: 'other' },
];

export const EXPENSE_GROUP_ORDER = ['daily', 'housing', 'health', 'family', 'commitments', 'shopping', 'other'];

export const INCOME_CATS: Category[] = [
  { id: 'salary', name: 'راتب', icon: 'salary' },
  { id: 'freelance', name: 'عمل حر / دخل إضافي', icon: 'laptop' },
  { id: 'debt_collect', name: 'تحصيل دين', icon: 'coindown' },
  { id: 'eidiya', name: 'هدية / عيدية', icon: 'gift' },
  { id: 'sell_item', name: 'بيع غرض', icon: 'tag' },
  { id: 'loan', name: 'قرض', icon: 'card' },
  { id: 'other_income', name: 'أخرى', icon: 'tag' },
];

export const ICON_KEYS = [
  'food', 'transport', 'bills', 'shopping', 'health', 'salary', 'laptop', 'gift', 'tag',
  'basket', 'home', 'bolt', 'wrench', 'pill', 'star', 'cap', 'heart', 'controller', 'repeat', 'fuel', 'coindown', 'card',
];

export interface Tip {
  title: string;
  body: string;
}

export const TIPS: Tip[] = [
  { title: 'قاعدة 50/30/20', body: 'اقسم دخلك: 50% ضروريات، 30% رغبات، 20% ادخار. طبّقها كل شهر دون تفاوض.' },
  { title: 'صندوق الطوارئ', body: 'وفّر مصاريف 3 أشهر في حساب منفصل. لا تلمسه إلا لحالات الضرورة فقط.' },
  { title: 'ادفع لنفسك أولاً', body: 'حوّل نسبة الادخار فور استلام الراتب، قبل أي إنفاق آخر.' },
  { title: 'قاعدة 24 ساعة', body: 'قبل شراء غير ضروري، أجّله يومًا كاملًا. القرار الثاني أوضح دائمًا.' },
  { title: 'سجّل كل عملية', body: 'لا تعتمد على الذاكرة. سجّل كل مصروف لحظة حدوثه، صغيرًا كان أو كبيرًا.' },
  { title: 'راجع أسبوعيًا', body: 'خصص 10 دقائق كل أسبوع لمراجعة إنفاقك وتصحيح الانحراف مبكرًا.' },
  { title: 'صفّ الديون الأعلى فائدة', body: 'سدد الدين الأعلى فائدة أولًا، ثم انتقل للتالي. توفّر أكثر على المدى الطويل.' },
  { title: 'أتمتة الادخار', body: 'فعّل تحويلًا شهريًا تلقائيًا للتوفير. لا تترك الادخار لقوة الإرادة.' },
];

export const INCOME_GROWTH_TIPS: Tip[] = [
  { title: 'نوّع مصادر دخلك', body: 'لا تعتمد على مصدر دخل واحد. جرّب عملاً حرًا أو مهارة تُدر دخلًا إضافيًا شهريًا.' },
  { title: 'استثمر الفائض بدل تركه', body: 'المال الذي لا يتحرك يفقد قيمته مع التضخم. حوّل ادخارك الفائض لاستثمار يناسب مستوى خطرك.' },
  { title: 'طوّر مهارة تزيد سعرك السوقي', body: 'ساعة تعلم أسبوعية في مهارة مطلوبة ترفع راتبك أو تفتح دخلاً جديدًا خلال أشهر.' },
  { title: 'قيّم راتبك كل سنة', body: 'راجع سوق العمل وتفاوض على راتبك أو غيّر جهة العمل إن كان أقل من قيمتك الحقيقية.' },
];

export const CURRENCIES: Currency[] = [
  { code: 'IQD', name: 'دينار عراقي', nameEn: 'Iraqi Dinar', symbol: 'د.ع', flag: '🇮🇶' },
  { code: 'SAR', name: 'ريال سعودي', nameEn: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'AED', name: 'درهم إماراتي', nameEn: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'KWD', name: 'دينار كويتي', nameEn: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'QAR', name: 'ريال قطري', nameEn: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'BHD', name: 'دينار بحريني', nameEn: 'Bahraini Dinar', symbol: 'د.ب', flag: '🇧🇭' },
  { code: 'OMR', name: 'ريال عماني', nameEn: 'Omani Rial', symbol: 'ر.ع', flag: '🇴🇲' },
  { code: 'YER', name: 'ريال يمني', nameEn: 'Yemeni Rial', symbol: 'ر.ي', flag: '🇾🇪' },
  { code: 'JOD', name: 'دينار أردني', nameEn: 'Jordanian Dinar', symbol: 'د.أ', flag: '🇯🇴' },
  { code: 'PSE', name: 'شيكل فلسطيني', nameEn: 'Palestinian (ILS)', symbol: '₪', flag: '🇵🇸' },
  { code: 'LBP', name: 'ليرة لبنانية', nameEn: 'Lebanese Pound', symbol: 'ل.ل', flag: '🇱🇧' },
  { code: 'SYP', name: 'ليرة سورية', nameEn: 'Syrian Pound', symbol: 'ل.س', flag: '🇸🇾' },
  { code: 'EGP', name: 'جنيه مصري', nameEn: 'Egyptian Pound', symbol: 'ج.م', flag: '🇪🇬' },
  { code: 'LYD', name: 'دينار ليبي', nameEn: 'Libyan Dinar', symbol: 'د.ل', flag: '🇱🇾' },
  { code: 'TND', name: 'دينار تونسي', nameEn: 'Tunisian Dinar', symbol: 'د.ت', flag: '🇹🇳' },
  { code: 'DZD', name: 'دينار جزائري', nameEn: 'Algerian Dinar', symbol: 'د.ج', flag: '🇩🇿' },
  { code: 'MAD', name: 'درهم مغربي', nameEn: 'Moroccan Dirham', symbol: 'د.م', flag: '🇲🇦' },
  { code: 'MRU', name: 'أوقية موريتانية', nameEn: 'Mauritanian Ouguiya', symbol: 'أ.م', flag: '🇲🇷' },
  { code: 'SDG', name: 'جنيه سوداني', nameEn: 'Sudanese Pound', symbol: 'ج.س', flag: '🇸🇩' },
  { code: 'SOS', name: 'شلن صومالي', nameEn: 'Somali Shilling', symbol: 'ش.ص', flag: '🇸🇴' },
  { code: 'DJF', name: 'فرنك جيبوتي', nameEn: 'Djiboutian Franc', symbol: 'ف.ج', flag: '🇩🇯' },
  { code: 'KMF', name: 'فرنك قمري', nameEn: 'Comorian Franc', symbol: 'ف.ق', flag: '🇰🇲' },
  { code: 'USD', name: 'دولار أمريكي', nameEn: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو', nameEn: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'جنيه إسترليني', nameEn: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'TRY', name: 'ليرة تركية', nameEn: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'INR', name: 'روبية هندية', nameEn: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'PKR', name: 'روبية باكستانية', nameEn: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰' },
  { code: 'JPY', name: 'ين ياباني', nameEn: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'يوان صيني', nameEn: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
];

export const ARABIC_MONTHS = [
  'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
  'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول',
];

// Mock "today" the prototype hardcoded around -- real app should use device date.
export const TODAY = '2026-08-11';
