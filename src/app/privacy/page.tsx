
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <h3 className="font-semibold text-lg text-foreground">1. Information We Collect</h3>
            <p>
              We collect information to provide better services to all our users. The types of information we collect include:
              Content you provide: When you upload study materials, create quizzes, or interact with our AI tutor, we store this content to personalize your learning experience.
              Usage data: We collect information about how you use our services, such as the topics you study, your quiz performance, and your interactions with features. This helps us understand your learning patterns and improve our platform.
            </p>

            <h3 className="font-semibold text-lg text-foreground">2. How We Use Information</h3>
            <p>
              We use the information we collect to operate, maintain, and improve our services. This includes:
              Personalizing your study plan and adapting the difficulty of content.
              Analyzing performance to provide you with actionable feedback.
              Developing new tools and features to enhance your learning journey.
            </p>

            <h3 className="font-semibold text-lg text-foreground">3. Information Sharing</h3>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of DragonAI except in the following cases:
              With your consent: We will share personal information when we have your explicit consent.
              For legal reasons: We will share personal information if we believe in good faith that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.
            </p>

            <h3 className="font-semibold text-lg text-foreground">4. Data Security</h3>
            <p>
              We work hard to protect DragonAI and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use encryption to keep your data private while in transit.
            </p>
            
            <h3 className="font-semibold text-lg text-foreground">5. Changes to This Policy</h3>
            <p>
              We may change this Privacy Policy from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
