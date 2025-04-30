"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload, ImageIcon, Trash2 } from "lucide-react"

export default function BlobUploadTest() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [testResults, setTestResults] = useState([])

  function addTestResult(success, message, details = null) {
    setTestResults((prev) => [
      {
        id: Date.now(),
        success,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(selectedFile)

    addTestResult(true, "File selected", {
      name: selectedFile.name,
      type: selectedFile.type,
      size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
    })
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)
    setUploadedUrl(null)

    try {
      addTestResult(true, "Starting upload", { fileName: file.name })

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload to Vercel Blob
      const response = await fetch("/api/upload-blob", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.url) {
        throw new Error("No URL returned from upload")
      }

      setUploadedUrl(data.url)
      addTestResult(true, "Upload successful", { url: data.url })
    } catch (err) {
      console.error("Error uploading file:", err)
      setError(err.message)
      addTestResult(false, "Upload failed", { error: err.message })
    } finally {
      setUploading(false)
    }
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    setUploadedUrl(null)
    addTestResult(true, "File cleared")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Vercel Blob Upload Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Image Upload</CardTitle>
            <CardDescription>Test uploading images to Vercel Blob storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Select Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
              </div>

              {preview && (
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Preview</h3>
                    <Button variant="ghost" size="sm" onClick={clearFile} disabled={uploading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {file?.name} ({(file?.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                {uploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Vercel Blob
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {uploadedUrl && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Upload Successful</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">Your file has been uploaded successfully!</p>
                    <p className="text-sm break-all">{uploadedUrl}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(uploadedUrl, "_blank")}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        View Image
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Log of upload test operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {testResults.map((result) => (
                <div key={result.id} className="border rounded-md p-3">
                  <div className="flex items-start space-x-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.message}</p>
                      <p className="text-gray-400 text-xs">{new Date(result.timestamp).toLocaleString()}</p>

                      {result.details && (
                        <div className="mt-2 bg-gray-50 p-2 rounded-md text-sm">
                          <pre className="whitespace-pre-wrap break-all text-xs">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {testResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No upload tests run yet</p>
                  <p className="text-sm">Select a file and click upload to start testing</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
