import BuildDiagnostics from "@/build-diagnostics"
import FixBuildIssues from "@/fix-build-issues"

export default function BuildFixPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">Build Error Diagnostics</h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto">
        This page helps diagnose and fix common webpack build errors in Next.js applications. Use these tools to
        identify and resolve issues that are preventing your app from building successfully.
      </p>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <BuildDiagnostics />
        <FixBuildIssues />
      </div>
    </div>
  )
}
