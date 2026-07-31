# Bio Link Hub

أريد بناء وتطوير موقع إلكتروني كامل ومستجيب (Responsive) يحاكي فكرة موقع Linktree الشهير لجمع روابط البايو والشبكات الاجتماعية (Link in Bio). أريدك أن تعمل كمطور Full-Stack محترف وخبير في هندسة واجهات المستخدم (UI/UX)، وتقوم بكتابة الشيفرة البرمجية كاملة، نظيفة، ومنظمة بناءً على الهيكل والمعايير التالية:

1. التقنيات المطلوبة (Tech Stack):

- الواجهة الأمامية (Frontend): استخدام HTML5 و JavaScript (Vanilla) مع الاعتماد الكامل على مكتبة Tailwind CSS للتصميم العصري والسريع، ومكتبة FontAwesome للأيقونات.

- تخزين البيانات (Data Storage): استخدام مصفوفة كائنات محلية (Mock Data) أو الـ LocalStorage لحفظ وتحديث روابط المستخدم وبياناته مباشرة في المتصفح دون الحاجة لإعداد خادم خارجي حالياً.

2. الميزات والأقسام المطلوبة في النظام:

أ) لوحة التحكم للمستخدم (Admin Dashboard):

- قسم لتعديل الملف الشخصي (Profile): يحتوي على حقول لتحديث الصورة الشخصية (عبر رابط URL)، الاسم الكامل، ونبذة تعريفية قصيرة (Bio).

- قسم إدارة الروابط (Links Manager): نموذج (Form) لإضافة رابط جديد يحتوي على (عنوان الزر، رابط الـ URL، وقائمة منسدلة لاختيار أيقونة مناسبة).

- قائمة تفاعلية تعرض الروابط الحالية المضافة مع توفير زر (حذف / Delete) لكل رابط بشكل فوري وديناميكي.

- قسم إدارة المظهر (Theme Selector): أزرار سريعة تتيح للمستخدم التبديل بين عدة مظاهر جاهزة ومريحة للعين (مثل: الوضع الفاتح Classic Light، الوضع الداكن Dark Mode، والوضع المتدرج Gradient Theme).

ب) شاشة المعاينة الحية الفورية (Live Preview Screen):

- واجهة تحاكي تصميم الهاتف الذكي (Mobile-First Frame) تموضع عناصرها بشكل عمودي متناسق في منتصف الشاشة وتتأثر لحظياً بكل تغيير يتم في لوحة التحكم.

- تعرض في الأعلى الصورة الشخصية بشكل دائرى أنيق، يليها الاسم، ثم النبذة التعريفية.

- تعرض الروابط المضافة على شكل أزرار عريضة (Full-Width Buttons) ذات حواف ناعمة، مع إضافة تأثير تحويم (Hover Effect) تفاعلي جذاب وجاذب للنقر.

- تذييل بسيط في أسفل شاشة المعاينة يحمل عبارة تسويقية للموقع.

3. شروط جودة الكود البرمجي:

- أريد الكود كاملاً في ملف واحد متكامل ومدمج (Single File Component) لسهولة تشغيله وتجربته فوراً.

- يمنع منعاً باتاً استخدام تعليقات الاختصار مكان الأكواد الفعلية (مثل: // ضع بقية الكود هنا أو // المنطق البرمجي يكتب هنا)، يجب كتابة المنطق البرمجي كاملاً وقابلاً للتنفيذ.

- يجب أن يكون التصميم متوافقاً تماماً مع شاشات الهواتف الذكية أولاً (Mobile-First) ثم يتسع ليناسب شاشات الحاسوب والتابلت.

ابدأ الآن ببناء وتوليد هذا الكود البرمجي المتكامل واعرضه لي مباشرة.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://linktood.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f75c74e-8f23-4b23-bb0a-51cec05db673).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
