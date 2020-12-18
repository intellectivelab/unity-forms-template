import React, {useRef, useState} from "react";
import * as R from "ramda";

import {Document, Page, pdfjs} from 'react-pdf';

import {ResourceViewSkeleton, useStaleQuery} from "@intellective/core";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useFileLoader = (href) => {
    const fetcher = (url) => fetch(url).then(response => response.arrayBuffer());

    return useStaleQuery(href, fetcher);
};

const calculateWidth = (ref) => ((ref && ref.current && ref.current.clientWidth || 1500) * 0.8);

const withFileLoader = R.curry((Viewer, props) => {
    const {status, data = null} = useFileLoader(props.filename);

    if (status === "loading") {
        return (
            <div style={{marginTop: "24px"}}>
                <ResourceViewSkeleton/>
            </div>
        );
    }

    return data && (
        <Viewer file={data} />
    );
});

const PdfViewer = ({file}) => {
    const [numPages, setNumPages] = useState(null);

    const ref = useRef();

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const showPage = index => (<Page key={`page_${index + 1}`} pageNumber={index + 1} width={calculateWidth(ref)}/>);

    return (
        <div ref={ref}>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                {R.times(showPage, numPages)}
            </Document>
        </div>
    );
};

export default withFileLoader(PdfViewer);