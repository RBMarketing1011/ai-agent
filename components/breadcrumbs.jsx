'use client'

import
{
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { House } from 'lucide-react'
import { useEffect, useState } from "react"

const Breadcrumbs = () =>
{
  const [ path, setPath ] = useState('')

  useEffect(() =>
  {
    // Access the window object safely on the client
    setPath(window?.location?.pathname || '')
  }, [])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">
            <House size={ 16 } />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {
          path.split('/').map((segment, index) =>
          {
            if (segment === '') return null

            if (index === path.split('/').length - 1)
            {
              return (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem key={ index }>
                    <BreadcrumbPage>
                      {
                        segment.split('-').map((word, index) =>
                        {
                          return (
                            <span key={ index }>
                              { word.charAt(0).toUpperCase() + word.slice(1) }
                              { ' ' }
                            </span>
                          )
                        })
                      }
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )
            } else
            {
              return (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ `/${ segment }` }>
                      {
                        segment.split('-').map((word, index) =>
                        {
                          return (
                            <span key={ index }>
                              { word.charAt(0).toUpperCase() + word.slice(1) }
                              { ' ' }
                            </span>
                          )
                        })
                      }
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )
            }
          })
        }

      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
