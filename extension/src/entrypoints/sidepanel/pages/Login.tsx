import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const handleContinue = () => {
    onLogin();
  };

  return (
    <div className="h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-[#161b22] border-[#30363d] text-white">
        <CardHeader>
          <CardTitle className="text-white">LeetCode Buddy</CardTitle>
          <CardDescription className="text-[#8b949e]">
            Compare LeetCode profiles and track progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[#8b949e] text-sm text-center mb-4">
            Start comparing LeetCode profiles to analyze and track your coding progress
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            onClick={handleContinue}
            className="w-full bg-[#ffffff] hover:bg-[#b2b2b2] text-black"
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
