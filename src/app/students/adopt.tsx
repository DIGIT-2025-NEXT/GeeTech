'use client'

import {Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions}  from '@mui/material';
import { useState } from 'react';
import { removeParticipartedid,addAdoptedid,removerejectedid,getCompanyById,getStudentById } from '@/lib/mock';
type Props = { studentid: string };
export default function AdoptButton({ studentid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const COMPANY_ID = '1';
    const handleSnackClose = () => setSnackOpen(false);
    const handleConfirm = () => {
        removerejectedid(COMPANY_ID,studentid);
        addAdoptedid(COMPANY_ID,studentid);
        setConfirmOpen(false);
    };
    const handleCancel = () => {
        setConfirmOpen(false);
    };
    const studentname = getStudentById(studentid)?.name;
    const adopt=()=>{
        const company = getCompanyById(COMPANY_ID);
        if (company?.adoptedid?.includes(studentid)) {
            setSnackMsg(`${studentname}はすでに採用しています`);
            setSnackOpen(true);
        } else if (company?.Rejectedid?.includes(studentid)) {
            // 確認のUIを表示
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装
            removeParticipartedid(COMPANY_ID,studentid);
            addAdoptedid(COMPANY_ID,studentid);
            setSnackMsg(`${studentname}を採用しました`);
            setSnackOpen(true);
            //採用通知の実装
        }
    };
    return(
        <>
        <Button onClick={() => adopt()}>採用する</Button>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose} message={snackMsg} />
        <Dialog open={confirmOpen} onClose={handleCancel}>
            <DialogTitle>{"注意"}</DialogTitle>
            <DialogContent>{studentname+"は不採用にされています"}<br />採用にしますか</DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} color="inherit">採用する</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">キャンセル</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
