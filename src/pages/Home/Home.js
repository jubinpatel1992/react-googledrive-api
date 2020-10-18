import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from '../../components/Loader/Loader';
import { TableWithSearch } from '../../components/TableWithSearch/TableWithSearch';

const access_token= 'ya29.a0AfH6SMAWA8bEmGUeScLR3mFzXbxnJviEdWpkQTe8-XpxvgB_NX3sDq7HcSvZx3uja99uGus8ApwWTWbaNEJ8CuhWJpYPtNKZRKY8dFdSAluQJFfBsp1026I7qh2p8GvCB_jguEXZ2Wn4hF0e-bCq0bicJv3HCIpwlXw';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [apiStatus, setApiStatus] = useState("Intializing google drive");
    const [gDriveData, setGDriveData] = useState([]);

    useEffect(() => {
      const getDriveData = (nextPageToken, data, pageNumber) => {
        let url = 'https://www.googleapis.com/drive/v3/files';
        let params = {
          fields: 'files(name,mimeType,webViewLink,iconLink),nextPageToken',
          pageSize: 1000
        };
  
        if(nextPageToken) params["pageToken"] = nextPageToken; 
        
        axios.get(url,{
          params,
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + access_token,
          }
        }).then(async (response) => {
          if(response.data.nextPageToken) {
            setApiStatus('Fetching page number ' + pageNumber++);          
            getDriveData(response.data.nextPageToken, [...data, ...response.data.files], pageNumber++);
          } else {
            setGDriveData([...data, ...response.data.files]);
            setIsLoading(false);
          }
        });
      }
      
      getDriveData(false, [], 1);
    }, []);

    return (
      <div className="container">
        {isLoading ? 
          <Loader status={apiStatus}/>
        :
          <TableWithSearch driveData={gDriveData} />
        }
      </div>
    );
  }