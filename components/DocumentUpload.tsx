import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

type Document = {
  name: string
  file: File | null
  progress: number
}

const requiredDocuments = {
  kindergarten: ['Birth Certificate', 'Latest Report Card'],
  elementary: ['Birth Certificate', 'Latest Report Card', 'Certificate of Good Moral Character'],
  'junior-high': ['Birth Certificate', 'Form 137', 'Certificate of Good Moral Character'],
  'senior-high': ['Birth Certificate', 'Form 137', 'Certificate of Good Moral Character', 'Grade 10 Report Card'],
}

export function DocumentUpload({ onComplete, gradeLevel }: { onComplete: (data: any) => void, gradeLevel: string }) {
  const [documents, setDocuments] = useState<Document[]>(
    requiredDocuments[gradeLevel as keyof typeof requiredDocuments].map(name => ({ name, file: null, progress: 0 }))
  )
  const { toast } = useToast()

  const handleFileChange = (index: number, file: File | null) => {
    const newDocuments = [...documents]
    newDocuments[index].file = file
    newDocuments[index].progress = 0
    setDocuments(newDocuments)
  }

  const handleUpload = async () => {
    const missingDocuments = documents.filter(doc => !doc.file)
    if (missingDocuments.length > 0) {
      toast({
        title: "Missing Documents",
        description: `Please upload all required documents: ${missingDocuments.map(doc => doc.name).join(', ')}`,
        variant: "destructive",
      })
      return
    }

    // Simulate file upload
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        const newDocuments = [...documents]
        newDocuments[i].progress = progress
        setDocuments(newDocuments)
      }
    }

    onComplete(documents)
  }

  return (
    <div className="space-y-6">
      {documents.map((doc, index) => (
        <div key={doc.name} className="space-y-2">
          <Label htmlFor={`file-${index}`}>{doc.name}</Label>
          <Input
            id={`file-${index}`}
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
          />
          {doc.file && (
            <Progress value={doc.progress} className="w-full" />
          )}
        </div>
      ))}
      <Button onClick={handleUpload}>Upload Documents</Button>
    </div>
  )
}

