import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState,useEffect,SetStateAction, Dispatch } from 'react';

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Bold,
  Title,
  Text
} from "@tremor/react";
import { spaceXLaunch, spaceXResponse } from '../types';

interface LaunchTableRowProps {
  data: spaceXLaunch
}

const LaunchTableRow = ({
  data: {
    name,
    links,
    failures,
    date_utc,
    cores,
    payloads,
    success,
  }
}: LaunchTableRowProps)=>
    <TableRow key={`${name}_b`}>
        <TableCell>
          <a href={links.webcast}>{name}</a>
        </TableCell>
        <TableCell>
          <a href={links.patch.small}>
            <img src={links.patch.small} className={styles.image} />
          </a>
        </TableCell>
        <TableCell>
          {success
            ? 'Success'
            : failures
                .map(({reason})=>
                  reason)
                .join(' ,')}
        </TableCell>
        <TableCell>
          {date_utc}
        </TableCell>
        <TableCell>
          {cores[0].core.serial}<br/><span className={styles.id_mono}>{cores[0].core.id}</span>
        </TableCell>
        <TableCell>
          {payloads[0].type}<br/><span className={styles.id_mono}>{payloads[0].id}</span>
        </TableCell>
    </TableRow>

interface LaunchDataTableProps{
  launches: spaceXLaunch[]
}

const LaunchDataTable = ({launches}: LaunchDataTableProps) =>
  <Table key={'display-table'}>
    <TableHead>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
        <TableHeaderCell>Outcome</TableHeaderCell>
        <TableHeaderCell>Date</TableHeaderCell>
        <TableHeaderCell>Cores</TableHeaderCell>
        <TableHeaderCell>Payloads</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {launches.map((launch)=>
      <LaunchTableRow
        key={launch.name}
        data={launch}
      />)}
    </TableBody>
  </Table>

interface PaginationProps {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  totalPages: number
}

const Pagination = ({page,setPage,pageSize,setPageSize,totalPages}: PaginationProps) =>
  <div key={'pagination-footer'} className={styles.pagination}>
    <button disabled={page<=0} onClick={()=>{
      setPage(_page=>
        Math.max(0,_page-1))
    }}>&laquo; Previous Page</button>
    <span>Page {page+1} of {totalPages}</span>
    <button disabled={page>=(totalPages-1)} onClick={()=>{
      setPage(_page=>
        Math.min((totalPages-1),_page+1))
    }}>Next Page &raquo;</button>
    <select defaultValue={pageSize} onChange={({target})=>{
      setPageSize(parseInt(target.value,10))
    }}>
      {[10,50,100].map((valPageSize)=>
        <option
          key={`ps_${valPageSize}`}
          value={valPageSize}
        >{valPageSize}</option>)}
    </select>
  </div>

const DisplayLaunches = ()=>{
  const [{docs: launchData, totalPages},setLaunchData] = useState<spaceXResponse>({docs:[],totalPages:0})
  const [page,setPage] = useState(0)
  const [pageSize,setPageSize] = useState(10)

  useEffect(()=>{
    fetchLaunchData(page,pageSize)
      .then((data)=>
        setLaunchData(data))
  },[page,pageSize])

  if(!launchData || totalPages<1 || launchData.length<1){
    return null
  }
  return (
    <div className={styles.card_table}>
      <Title
        className={styles.table_title}
      >Spacex Launches V5</Title>
      <LaunchDataTable
        launches={launchData} />
      <Pagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  )
}


async function fetchLaunchData(page: number, pageSize: number): Promise<spaceXResponse> { //mutable array
  return fetch('https://api.spacexdata.com/v5/launches/query',{
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      query: {},
      options: {
        page: page+1,
        limit: pageSize,
        pagination: true,
        populate: ['payloads','cores.core'],
      }
    })
  })
    .then((response) => response.json())
    .then(async ({docs,totalPages})=>{
      if(docs===undefined || !Array.isArray(docs)){
        throw "Bad response"
      }
      
      return {
        totalPages,
        docs,
      }
    })
}

const HomeFooter = ()=>
  <footer className={styles.footer}>
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by{' '}
      <span className={styles.logo}>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span>
    </a>
  </footer>

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <meta name="description" content="A table view of SpaceX launches" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DisplayLaunches />
      <HomeFooter />
    </div>
)}
