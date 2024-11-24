'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { reader } from '@/lib/aiUtils'
import Markdown from 'react-markdown'
import { pageOptions } from '@/lib/data/pageOptions'
import { set } from 'zod'
import Loading from '@/components/atom/Loading'

function classNames (...classes)
{
  return classes.filter(Boolean).join(' ')
}

const PageGenerator = () =>
{
  const [ loading, setLoading ] = useState(false)

  const [ shopName, setShopName ] = useState('Alana Automotive')
  const [ city, setCity ] = useState('Bowdon')
  const [ state, setState ] = useState('GA')

  const [ pageContent, setPageContent ] = useState([])
  const [ pageContentView, setPageContentView ] = useState('')
  const [ currentTab, setCurrentTab ] = useState('services')
  const [ pagesSelected, setPagesSelected ] = useState([])

  const handleSubmit = async () =>
  {
    if (!shopName || !city || !state || !pagesSelected.length)
    {
      alert('Please fill out all fields and select at least one page to generate content for.')
      return
    }

    setPageContentView(pagesSelected[ 0 ])
    setLoading(true) // Set loading before validation exits

    try
    {
      for (const page of pagesSelected)
      {
        const res = await fetch('/api/genPageContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shopName, city, state, page }),
        })

        await reader(page, res, setPageContent)
      }
    } catch (error)
    {
      alert(error.message)
    } finally
    {
      // Ensure loading is set to false regardless of success or failure
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="h-[89vh] rounded-xl bg-muted/50 flex flex-col justify-between items-center gap-3 p-3">
          <div className='w-full'>
            <h1 className='text-3xl font-bold'>AI Page Generator</h1>
            <div className='my-3 w-full h-1 bg-gray-200' />
            <p>
              Choose the pages you want to generate content for:
            </p>
            {/* TABS */ }
            <div className='my-3'>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */ }
                <select
                  id="tabs"
                  name="tabs"
                  defaultValue={ Object.keys(pageOptions).name === currentTab.toLowerCase() }
                  onChange={ (e) => setCurrentTab(e.target.value) }
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {
                    Object.keys(pageOptions).map((tab) => (

                      <option key={ tab } value={ tab }>
                        {
                          tab.charAt(0).toUpperCase() + tab.slice(1)
                        }
                      </option>

                    ))
                  }
                </select>
              </div>
              <div className="hidden sm:block">
                <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
                  {
                    Object.keys(pageOptions).map((tab, tabIdx) => (
                      <a
                        key={ tab.name }
                        href={ tab.href }
                        aria-current={ tab.current ? 'page' : undefined }
                        className={ classNames(
                          tab === currentTab.toLowerCase() ? 'text-white bg-gray-700' : 'text-gray-500 hover:text-gray-700',
                          tabIdx === 0 ? 'rounded-l-lg' : '',
                          tabIdx === Object.keys(pageOptions).length - 1 ? 'rounded-r-lg' : '',
                          'group relative min-w-0 flex-1 overflow-hidden p-2 text-center text-sm font-medium hover:bg-gray-500 hover:text-white focus:z-10 hover:cursor-pointer',
                        ) }
                        onClick={ () => setCurrentTab(tab) }
                      >
                        <span>
                          {
                            tab.charAt(0).toUpperCase() + tab.slice(1)
                          }
                        </span>
                        <span
                          aria-hidden="true"
                          className={ classNames(
                            tab.current ? 'bg-indigo-500' : 'bg-transparent',
                            'absolute inset-x-0 bottom-0 h-0.5',
                          ) }
                        />
                      </a>

                    ))
                  }
                </nav>
              </div>
            </div>
            {/* SELECTIONS */ }
            <fieldset>
              <legend className="sr-only">Pages to generate content for</legend>
              <div>

                {
                  pageOptions[ currentTab ]
                    .sort((a, b) => a.localeCompare(b))
                    .length > 20 ? (

                    <div className="flex flex-wrap">
                      {
                        pageOptions[ currentTab ]
                          .slice()
                          .sort((a, b) => a.localeCompare(b))
                          .map((option, index) => (

                            <div
                              key={ `${ currentTab }-${ index }` }
                              className={ `w-1/2 ${ index % 2 === 0 ? 'pr-2' : 'pl-2' }` } // Split into 2 columns
                            >
                              <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                  <input
                                    id={ `${ currentTab }-offers-${ index }` } // Include the tab in the ID
                                    name="offers"
                                    type="checkbox"
                                    aria-describedby="offers-description"
                                    className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    checked={ pagesSelected.includes(option) } // Track by tab and option
                                    onChange={ (e) => setPagesSelected((prev) =>
                                    {
                                      if (prev.includes(option))
                                      {
                                        return prev.filter((item) => item !== option)
                                      } else
                                      {
                                        return [ ...prev, option ]
                                      }
                                    }) }
                                  />
                                </div>
                                <div className="ml-3 text-sm/6">
                                  <label
                                    htmlFor={ `${ currentTab }-offers-${ index }` }
                                    className="font-medium text-gray-900"
                                  >
                                    { option }
                                  </label>
                                </div>
                              </div>
                            </div>

                          ))
                      }

                    </div>

                  ) : (

                    <div>
                      {
                        pageOptions[ currentTab ]
                          .slice()
                          .sort((a, b) => a.localeCompare(b))
                          .map((option, index) => (

                            <div
                              key={ `${ currentTab }-${ index }` }
                              className="relative flex items-start"
                            >
                              <div className="flex h-6 items-center">
                                <input
                                  id={ `${ currentTab }-offers-${ index }` } // Include the tab in the ID
                                  name="offers"
                                  type="checkbox"
                                  aria-describedby="offers-description"
                                  className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  checked={ pagesSelected.includes(option) } // Track by tab and option
                                  onChange={ (e) => setPagesSelected((prev) =>
                                  {
                                    if (prev.includes(option))
                                    {
                                      return prev.filter((item) => item !== option)
                                    } else
                                    {
                                      return [ ...prev, option ]
                                    }
                                  }) }
                                />
                              </div>
                              <div className="ml-3 text-sm/6">
                                <label
                                  htmlFor={ `${ currentTab }-offers-${ index }` }
                                  className="font-medium text-gray-900"
                                >
                                  { option }
                                </label>
                              </div>
                            </div>

                          ))
                      }

                    </div>
                  )
                }

              </div>
            </fieldset>
          </div>
          <div className='w-full flex justify-between items-center gap-3'>
            <div className='w-full space-y-3'>
              <input
                type="text"
                placeholder='Enter Shop Name'
                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
                value={ shopName }
                onChange={ (e) => setShopName(e.target.value) }
              />
              <input
                type="text"
                placeholder='Enter City'
                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
                value={ city }
                onChange={ (e) => setCity(e.target.value) }
              />
              <select
                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
                defaultValue={ state || 'blank' }
                onChange={ (e) => setState(e.target.value) }
              >
                <option value="blank" disabled>Choose State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
          </div>
        </div>
        <div className="h-[89vh] overflow-y-auto rounded-xl bg-muted/50 p-3">
          <div className='w-full flex justify-between items-center'>
            <h2 className='text-3xl font-bold'>Chosen Pages</h2>
            <button
              disabled={ loading }
              className='h-full flex justify-center items-center gap-3 px-3 py-1.5 text-white bg-gray-500 hover:bg-gray-600 rounded-md hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
              onClick={ () => handleSubmit() }
            >
              {
                loading ?

                  <Loading />

                  :

                  <>
                    <Send
                      className='w-6 h-6'
                    />
                    Run Pages
                  </>
              }
            </button>
          </div>
          <div className='my-3 w-full h-1 bg-gray-200' />
          <p>
            Select a page to view its content:
          </p>
          <div className='my-3 w-full h-1 bg-gray-200' />

          <nav aria-label="Sidebar" className="w-full flex flex-1 px-3">
            <ul role="list" className="w-full flex justify-between flex-wrap gap-2">
              {
                pagesSelected
                  .sort((a, b) => a.localeCompare(b))
                  .map((item) => (

                    <li key={ item } className='w-full'>
                      <button
                        className={ classNames(
                          pageContentView === item ? 'bg-gray-500 text-white' : 'text-gray-700 hover:bg-gray-500 hover:text-white',
                          'w-full group flex gap-x-3 rounded-md p-1 pl-3 text-sm/6 font-semibold cursor-pointer bg-gray-200',
                        ) }
                        onClick={ () => setPageContentView(item) }
                      >
                        { item }
                      </button>
                    </li>

                  ))
              }
            </ul>
          </nav>
        </div>
        <div className="h-[89vh] overflow-y-auto rounded-xl bg-muted/50 p-3">
          {
            pageContent &&
            pageContent.map((data, index) => (

              data?.page === pageContentView &&

              <div key={ index } className='w-full'>
                <div>
                  <h2 className='text-xl font-bold'>Metadata</h2>
                  <div className="ml-3 mt-3">
                    <p>
                      <span className="font-semibold">
                        SEO Title:{ ' ' }
                      </span>
                      { data?.content?.metadata?.seo_title }
                    </p>
                    <p>
                      <span className="font-semibold">
                        Slug:{ ' ' }
                      </span>
                      { data?.content?.metadata?.slug }
                    </p>
                    <p>
                      <span className="font-semibold">
                        SEO Description:{ ' ' }
                      </span>
                      { data?.content?.metadata?.seo_description }
                    </p>
                  </div>
                </div>

                <div className='w-full h-1 bg-gray-200 mt-3' />

                <div className="mt-3">
                  <h2 className='text-xl font-bold'>Images</h2>
                  <div className="ml-3 mt-3">
                    <p>
                      <span className="font-semibold">
                        Banner Image URL:{ ' ' }
                      </span>
                      { data?.content?.images?.banner_image?.url }
                    </p>
                    <p>
                      <span className="font-semibold">
                        Banner Image Alt:{ ' ' }
                      </span>
                      { data?.content?.images?.banner_image?.alt }
                    </p>
                    <p>
                      <span className="font-semibold">
                        Featured Image URL:{ ' ' }
                      </span>
                      { data?.content?.images?.featured_image?.url }
                    </p>
                    <p>
                      <span className="font-semibold">
                        Featured Image Alt:{ ' ' }
                      </span>
                      { data?.content?.images?.featured_image?.alt }
                    </p>
                  </div>
                </div>

                <div className='w-full h-1 bg-gray-200 mt-3' />

                <div className='mt-3'>
                  <h2 className='text-xl font-bold'>Content</h2>

                  <div className='w-full h-1 bg-gray-200 mt-5' />

                  <div className='mt-5 flex flex-col items-start gap-5'>
                    <h1 className='text-3xl font-extrabold'>
                      { data?.content?.page_title }
                    </h1>
                    <Markdown>
                      { data?.content?.content?.intro }
                    </Markdown>
                    <div>
                      {
                        data?.content?.content?.page_content?.map((section, index) => (
                          <div key={ index } className='flex flex-col items-start gap-5 mb-5'>
                            <h2 className='text-xl font-semibold'>{ section.heading }</h2>
                            <div>
                              {
                                <Markdown>
                                  { section?.content }
                                </Markdown>
                              }
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>

            ))
          }

        </div>
      </div>
    </div>
  )
}

export default PageGenerator