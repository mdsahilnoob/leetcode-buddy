import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-[#161b22] border-[#30363d] text-white">
        <CardHeader>
          <CardTitle className="text-white">Login to your account</CardTitle>
          <CardDescription className="text-[#8b949e]">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#c9d1d9]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-[#6e7681] focus-visible:ring-[#58a6ff]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#c9d1d9]">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-[#58a6ff]"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-[#6e7681] focus-visible:ring-[#58a6ff]" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full bg-[#ffffff] hover:bg-[#b2b2b2] text-black" onClick={(e) => { e.preventDefault(); onLogin(); }}>
            Login
          </Button>
          <Button variant="outline" className="w-full bg-[#000000] text-[#ffffff] hover:bg-[#21262d] hover:text-white">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
