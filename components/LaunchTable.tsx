import styles from '../styles/Home.module.css';
import { useState,useEffect } from 'react';
import { format } from 'date-fns'

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


import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Title
} from "@tremor/react";

import {
    spaceXResponse,
    LaunchTableRowProps,
    PaginationProps,
    LaunchDataTableProps
} from '../types';

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
          <a id='video-link' href={links.webcast}>{name}</a>
        </TableCell>
        <TableCell>
          <a id='image-link' href={links.patch.small}>
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
          {format(new Date(date_utc),'dd/MM/yyyy')}
        </TableCell>
        <TableCell>
          {cores[0].core.serial}<br/><span className={styles.id_mono}>{cores[0].core.id}</span>
        </TableCell>
        <TableCell>
          {payloads[0].type}<br/><span className={styles.id_mono}>{payloads[0].id}</span>
        </TableCell>
    </TableRow>

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

const Pagination = ({page,setPage,pageSize,setPageSize,totalPages}: PaginationProps) =>
  <div key={'pagination-footer'} className={styles.pagination}>
    <button data-cy='minus' disabled={page<=0} onClick={()=>{
      setPage(_page=>
        Math.max(0,_page-1))
    }}>&laquo; Previous Page</button>
    <span className={styles.current_page}>Page {page+1} of {totalPages}</span>
    <button data-cy='plus' disabled={page>=(totalPages-1)} onClick={()=>{
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
    <div className={[styles.card_table].join()}>
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

export {
    DisplayLaunches,
    Pagination,
    LaunchDataTable,
    LaunchTableRow
}
