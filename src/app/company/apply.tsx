'use client'

import {Button, Snackbar, Dialog, DialogContent, DialogActions}  from '@mui/material';
import { useState } from 'react';
import { addParticipartedid,getCompanyById } from '@/lib/mock';
type Props = { companyid: string };
export default function ApplyButton({ companyid: companyid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [UItext, setUItext] = useState<string>('');
    const STUDENT_ID = '2';
    const handleSnackClose = () => setSnackOpen(false);
    const handleCancel = () => {
        setConfirmOpen(false);
    };
    const companyname = getCompanyById(companyid)?.name;
    const apply=()=>{
        const company = getCompanyById(companyid);
        if (company?.partcipantsid?.includes(STUDENT_ID)) {
            setSnackMsg(`${companyname}にすでに応募しています`);
            setSnackOpen(true);
        } else if (company?.adoptedid?.includes(STUDENT_ID)) {
            setUItext(`あなたは${companyname}に採用されています`)
            setConfirmOpen(true);
        } else if (company?.Rejectedid?.includes(STUDENT_ID)){
            setUItext(`あなたは${companyname}に不採用にされています`)
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装
            addParticipartedid(companyid,STUDENT_ID);
            setSnackMsg(`${companyname}に応募しました`);
            setSnackOpen(true);
        }
    };
    return(
        <>
        <Button onClick={() => apply()}>応募する</Button>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose} message={snackMsg} />
        <Dialog open={confirmOpen} onClose={handleCancel}>
            <DialogContent>{UItext}</DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="contained" color="primary">OK</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}