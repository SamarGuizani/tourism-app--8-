"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthTest() {
  const [activeTab, setActiveTab] = useState("signin")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [testResults, setTestResults] = useState({})

  // Sign In form
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Register form
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerUserType, setRegisterUserType] = useState("tourist")

  const supabase = createClientComponentClient()

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      if (data.session) {
        setUser(data.session.user)
        addTestResult("session", true, "Active session found")
      } else {
        setUser(null)
        addTestResult("session", false, "No active session")
      }
    } catch (err) {
      console.error("Session check error:", err)
      addTestResult("session", false, `Error: ${err.message}`)
    }
  }

  function addTestResult(test, success, message) {
    setTestResults((prev) => ({
      ...prev,
      [test]: { success, message, timestamp: new Date().toISOString() },
    }))
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      addTestResult("signin_attempt", true, `Attempting to sign in with email: ${signInEmail}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      })

      if (error) throw error

      setUser(data.user)
      setSuccess("Successfully signed in!")
      addTestResult("signin", true, "Sign in successful")

      // Clear form
      setSignInEmail("")
      setSignInPassword("")
    } catch (err) {
      console.error("Sign in error:", err)
      setError(err.message)
      addTestResult("signin", false, `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      addTestResult("register_attempt", true, `Attempting to register with email: ${registerEmail}`)

      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
            is_tourist: registerUserType === "tourist",
            is_local: registerUserType === "local",
            is_guide: false,
          },
        },
      })

      if (error) throw error

      setSuccess("Registration successful! Check your email for confirmation.")
      addTestResult("register", true, "Registration successful")

      // Clear form
      setRegisterEmail("")
      setRegisterPassword("")
      setRegisterName("")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message)
      addTestResult("register", false, `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    setLoading(true)

    try {
      addTestResult("signout_attempt", true, "Attempting to sign out")

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setSuccess("Successfully signed out!")
      addTestResult("signout", true, "Sign out successful")
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err.message)
      addTestResult("signout", false, `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In Test</TabsTrigger>
              <TabsTrigger value="register">Registration Test</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Test Sign In</CardTitle>
                  <CardDescription>Test the sign in functionality with your credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Test Registration</CardTitle>
                  <CardDescription>Test the registration functionality with new credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>User Type</Label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="tourist"
                            checked={registerUserType === "tourist"}
                            onChange={() => setRegisterUserType("tourist")}
                          />
                          <span>Tourist</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="local"
                            checked={registerUserType === "local"}
                            onChange={() => setRegisterUserType("local")}
                          />
                          <span>Local</span>
                        </label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Registering..." : "Register"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current User</CardTitle>
              <CardDescription>Information about the currently authenticated user</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                  </p>

                  <Button onClick={handleSignOut} className="w-full mt-4" variant="outline" disabled={loading}>
                    {loading ? "Signing out..." : "Sign Out"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No user is currently signed in</p>
                  <Button onClick={checkSession} className="mt-2" variant="outline" size="sm">
                    Check Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="flex items-start space-x-2 text-sm">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{test.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                      <p className="text-gray-600">{result.message}</p>
                      <p className="text-gray-400 text-xs">{new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {Object.keys(testResults).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No tests run yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
