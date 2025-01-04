import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { FilePdf } from '@phosphor-icons/react'

interface EnrollmentSlipDownloadProps {
  applicationId: string
  isApproved: boolean
}

export function EnrollmentSlipDownload({ applicationId, isApproved }: EnrollmentSlipDownloadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!isApproved) {
      toast({
        title: "Error",
        description: "Your application must be approved to download the enrollment slip.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/generate-pdf?type=enrollment-slip&id=${applicationId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `enrollment-slip-${applicationId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to generate enrollment slip')
      }
    } catch (error) {
      console.error('Error downloading enrollment slip:', error)
      toast({
        title: "Error",
        description: "Failed to download enrollment slip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={!isApproved || isLoading} className="flex items-center">
      <FilePdf className="mr-2" size={20} />
      {isLoading ? 'Downloading...' : 'Download Enrollment Slip'}
    </Button>
  )
}

