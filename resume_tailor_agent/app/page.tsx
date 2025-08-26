"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Download, Sparkles, FileText, Zap, ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function ResumeTailorApp() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [tailoredResume, setTailoredResume] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDownloadOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleTailorResume = async () => {
    if (!resumeFile || !jobDescription.trim()) return

    setIsProcessing(true)
    setError(null)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', resumeFile)
      formData.append('job_description', jobDescription)

      // Call your FastAPI backend
      const response = await fetch('http://localhost:9000/tailor-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Set the analysis as the tailored resume
        setTailoredResume(result.analysis)
        setError(null)
      } else {
        setError('Failed to process resume. Please try again.')
        setTailoredResume('')
      }
    } catch (error) {
      console.error('Error calling API:', error)
      setError('Could not connect to the resume tailoring service. Please ensure the backend is running on http://localhost:8000')
      setTailoredResume('')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (format: 'txt' | 'md' = 'md') => {
    if (!tailoredResume) return
    
    const timestamp = new Date().toISOString().slice(0, 10) // YYYY-MM-DD format
    const originalName = resumeFile?.name.replace(/\.[^/.]+$/, "") || "resume"
    
    let content = tailoredResume
    let mimeType = "text/plain"
    let extension = "txt"
    
    if (format === 'md') {
      mimeType = "text/markdown"
      extension = "md"
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${originalName}-tailored-${timestamp}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ResumeAI</h1>
              <p className="text-sm text-muted-foreground">Tailor your resume with AI precision</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>Upload your current resume to get started with AI-powered tailoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm font-medium text-foreground mb-2">
                      {resumeFile ? resumeFile.name : "Click to upload your resume"}
                    </p>
                    <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, TXT files</p>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Job Description
                </CardTitle>
                <CardDescription>Paste the job description to tailor your resume accordingly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the complete job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleTailorResume}
              disabled={!resumeFile || !jobDescription.trim() || isProcessing}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Zap className="w-5 h-5 mr-2 animate-spin" />
                  Tailoring Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Tailor Resume with AI
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Tailored Resume
                  </span>
                  {tailoredResume && (
                    <div className="relative" ref={dropdownRef}>
                      <div className="flex">
                        <Button
                          onClick={() => handleDownload('md')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent rounded-r-none"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                          variant="outline"
                          size="sm"
                          className="px-2 border-l-0 rounded-l-none"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                      {showDownloadOptions && (
                        <div className="absolute right-0 top-10 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[120px]">
                          <button
                            onClick={() => {
                              handleDownload('md')
                              setShowDownloadOptions(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Markdown (.md)
                          </button>
                          <button
                            onClick={() => {
                              handleDownload('txt')
                              setShowDownloadOptions(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Text (.txt)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CardTitle>
                <CardDescription>Your AI-optimized resume tailored for the specific job</CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Error Processing Resume</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 max-w-sm">
                      {error}
                    </p>
                    <Button 
                      onClick={() => setError(null)} 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : tailoredResume ? (
                  <div className="bg-muted/50 rounded-lg p-6 min-h-[400px] overflow-auto">
                    <div className="markdown-content text-foreground leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-primary">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-primary">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-medium mb-2 text-primary">{children}</h3>,
                          p: ({children}) => <p className="mb-3 text-foreground">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-foreground">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-primary">{children}</strong>,
                          em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                          code: ({children}) => <code className="bg-background px-1 py-0.5 rounded text-sm text-accent font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">{children}</blockquote>
                        }}
                      >
                        {tailoredResume}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Ready to tailor your resume?</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload your resume and paste a job description to get started with AI-powered resume tailoring.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes job requirements and optimizes your resume accordingly
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Keyword Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Automatically highlights relevant skills and experiences for better ATS compatibility
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Download</h3>
              <p className="text-sm text-muted-foreground">
                Get your tailored resume instantly in multiple formats ready for applications
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
