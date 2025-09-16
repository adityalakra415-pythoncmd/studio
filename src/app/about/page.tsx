
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About DragonAI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to DragonAI, your personalized learning engine designed to revolutionize the way you study. 
              Our mission is to empower students everywhere by providing adaptive, engaging, and accessible educational tools.
            </p>
            <p>
              At DragonAI, we believe that education should be tailored to the individual. Our platform leverages the power of artificial
              intelligence to create dynamic study plans, generate on-the-fly quizzes, and provide instant, one-on-one tutoring. 
              Whether you're tackling a new subject or preparing for an exam, DragonAI adapts to your pace and learning style, 
              ensuring you master concepts with confidence.
            </p>
            <p>
              Our team is composed of passionate educators, technologists, and AI experts dedicated to making learning a more
              effective and enjoyable experience. We are constantly innovating and improving our platform to meet the evolving
              needs of modern learners.
            </p>
            <p>
              Thank you for choosing DragonAI. Let's embark on this learning journey together.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
