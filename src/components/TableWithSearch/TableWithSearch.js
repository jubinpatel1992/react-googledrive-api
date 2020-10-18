import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

import './TableWithSearch.css';
const collabels = [ "File Title", "File Icon"];

export const TableWithSearch = ({ driveData }) => {
    const [displayDriveData, setDisplayDriveData] = useState(driveData.slice(0,10));
    const [searchData, setSearchData] = useState(false);
    const [paginationLength] = useState(parseInt(driveData.length/10));

    const handlePageClick = (data) => {
        const selected = data.selected * 10;
        setDisplayDriveData(driveData.slice(selected,selected + 10));
    };

    const handleSearch = (e) => {
        if(e.target.value.trim() !== '') {
            let first = [], second = [], third = [], searchText = e.target.value.trim();
            
            let reg = new RegExp('\\b' + searchText.replace(' ', '\\b.*\\b') + '\\b');

            for(let i=0; i<driveData.length; i++) {                
                let match = reg.exec(driveData[i].name);
                if(match && match.index === 0 && match[0].length === searchText.length) {
                    first.push(driveData[i]);
                } else if(match && match.index > 0 && match[0].length === searchText.length) {
                    second.push(driveData[i]);
                } else if(match) {
                    third.push(driveData[i]);   
                }

                if(first.length === 20) {
                    break;
                }
            }

            if(first.length === 20) {
                setSearchData(first);
            } else {
                setSearchData(first.concat(second, third));
            }
        } else {
            setSearchData(false);
        }
    }

    return (
        <div className="table-container">
            <input className="input-field" type="text" onChange={(e) => handleSearch(e)} placeholder="Search for a file"></input>
            
            <table>
                <thead>
                    <tr>
                        {collabels.map((label, index) => (
                            <th key={index}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {searchData 
                    ? 
                        [...Array(searchData.length >= 20 ? 20 : searchData.length)].map((item, index) => (
                            <tr key={index}>
                                <td>{searchData[index].name}</td>
                                <td><a rel="noopener noreferrer" href={searchData[index].webViewLink} target="_blank"><img src={searchData[index].iconLink} alt={searchData[index].name}/></a></td>
                            </tr>
                        ))
                    :                
                        displayDriveData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td><a rel="noopener noreferrer" href={item.webViewLink} target="_blank"><img src={item.iconLink} alt={item.name}/></a></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
            {!searchData ? 
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={paginationLength}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={4}
                    onPageChange={(data) => handlePageClick(data)}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            : ""}
        </div>
    )
}