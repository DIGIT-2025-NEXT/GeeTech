'use client'

import {Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography}  from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
type Props = { studentid: string };
export default function AdoptButton({ studentid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const {user} = useAuth();
    const [studentname, setStudentName]=useState<string>('');
    const supabase = createClient();
    const COMPANY_ID = user?.id?? '';
    const handleSnackClose = () => setSnackOpen(false);
    const handleConfirm = async() => {
        const { data: company } = await supabase
                .from('company')
                .select('*')
                .eq('id', COMPANY_ID)
                .single();
        const { data: studentprofile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', studentid)
                .single();
        setStudentName(studentprofile?.username);
        const newRejectedIDArray = [...(company?.rejectedid || [])].filter((aaa)=>aaa!==studentid);
            const newAodptedIDArray = [...(company?.adoptedid || []), studentid];
            const {data,error}= await supabase
                .from('company')
                .update({ rejectedid: newRejectedIDArray,adoptedid:newAodptedIDArray})
                .eq("id",COMPANY_ID)
            if(error){
                
            console.log(`${error.code}`);
                setSnackMsg(`採用に失敗しました`);
                setSnackOpen(true);
                return
            }
            setSnackMsg(`${studentname}を採用しました`);
            setSnackOpen(true);
            //採用通知の実装
        setConfirmOpen(false);
    };
    const handleCancel = () => {
        setConfirmOpen(false);
    };
    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
    };
    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };
    const adopt=async()=>{
        if (!user?.id) {
            setLoginDialogOpen(true);
            return;
        }
        const { data: company } = await supabase
                .from('company')
                .select('*')
                .eq('id', COMPANY_ID)
                .single();
        const { data: studentprofile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', studentid)
                .single();
        setStudentName(studentprofile?.username);
        const adoptedIds: string[] = company.adoptedid??[];
        const rejectedIds: string[] = company.rejectedid??[];
        if (adoptedIds.includes(studentid)) {
            setSnackMsg(`${studentname}はすでに採用しています`);
            setSnackOpen(true);
        } else if (rejectedIds?.includes(studentid)) {
            // 確認のUIを表示
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装
            const newApplyedIDArray = [...(company?.participants_id || [])].filter((aaa)=>aaa!==studentid);
            const newAodptedIDArray = [...(company?.adoptedid || []), studentid];
            const {data,error}= await supabase
                .from('company')
                .update({ participants_id: newApplyedIDArray,adoptedid:newAodptedIDArray})
                .eq("id",COMPANY_ID)
            if(error){
                
            console.log(`${error.code}`);
                setSnackMsg(`採用に失敗しました`);
                setSnackOpen(true);
                return
            }
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
        <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose}>
            <DialogTitle>ログインが必要です</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, py: 2 }}>
                    <Typography variant="body1">
                        採用するにはログインが必要です。
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ログインページに移動してアカウントにサインインしてください。
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button onClick={handleLoginDialogClose} variant="outlined" sx={{ mr: 1 }}>
                    キャンセル
                </Button>
                <Button onClick={handleLoginRedirect} variant="contained" color="primary">
                    ログインページへ
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
