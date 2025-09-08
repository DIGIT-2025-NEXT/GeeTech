'use client'
import {Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions}  from '@mui/material';
import { useState } from 'react';
import { removeParticipartedid,removeAdoptedid,addRejectedid,getCompanyById,getStudentById } from '@/lib/mock';
type Props = { studentid: string };
export default function RejectButton({ studentid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const COMPANY_ID = '1';
    const handleSnackClose = () => setSnackOpen(false);
    const handleConfirm = () => {
        removeAdoptedid(COMPANY_ID,studentid);
        addRejectedid(COMPANY_ID,studentid);
        setConfirmOpen(false);
    };
    const handleCancel = () => {
        setConfirmOpen(false);
    };
    const studentname = getStudentById(studentid)?.name;
    const reject=()=>{
        const company = getCompanyById(COMPANY_ID);
        if (company?.Rejectedid?.includes(studentid)) {
            setSnackMsg(`${studentname}はすでに不採用にしています`);
            setSnackOpen(true);
        } else if (company?.adoptedid?.includes(studentid)) {
            // 確認のUIを表示
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装
            removeParticipartedid(COMPANY_ID,studentid);
            addRejectedid(COMPANY_ID,studentid);
            setSnackMsg(`${studentname}を不採用にしました`);
            setSnackOpen(true);
            //採用通知の実装
        }
    };
    return(
        <>
        <Button onClick={() => reject()}>不採用にする</Button>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose} message={snackMsg} />
        <Dialog open={confirmOpen} onClose={handleCancel}>
            <DialogTitle>注意</DialogTitle>
            <DialogContent>{studentname+"は採用されています"}<br />不採用にしますか</DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} color="inherit">不採用にする</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">キャンセル</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
