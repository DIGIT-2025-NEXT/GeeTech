'use client'

import {Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography}  from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import { SendNotificationParams } from '@/contexts/NotificationContext';
type Props = { studentid: string };
export default function RejectButton({ studentid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const {user} = useAuth();
    const [studentname, setStudentName]=useState<string>('');
    const supabase = createClient();
    const COMPANY_ID = user?.id?? '';
    const [companyname,setCompanyName]=useState("");
    const title=`${companyname}からの不採用通知`;
    const body=`申し訳ございませんが、${companyname}では今回は見送らせていただきます`;
    const link=`/dashboard`;
    const { sendNotification } = useNotifications();
    const handleSnackClose = () => setSnackOpen(false);
    const handleSend = async () => {
    const params: SendNotificationParams = {
      recipient_id: studentid,
      title,
      body,
      link: link || undefined,
    };

    try {
      await sendNotification(params);
    } catch (error) {
    }
  };
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
        setCompanyName(company.name);
        setStudentName(studentprofile?.username);
        const  newAodptedIDArray= [...(company?.adoptedid || [])].filter((aaa)=>aaa!==studentid);
            const newRejectedIDArray = [...(company?.rejectedid || []), studentid];
            const {error}= await supabase
                .from('company')
                .update({ rejectedid: newRejectedIDArray,adoptedid:newAodptedIDArray})
                .eq("id",COMPANY_ID)
            if(error){
                setSnackMsg(`不採用に失敗しました`);
                setSnackOpen(true);
                return
            }
            handleSend();
            setSnackMsg(`${studentname}を不採用にしました`);
            setSnackOpen(true);
            //不採用通知の実装
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
        setCompanyName(company.name);
        setStudentName(studentprofile?.username);
        const adoptedIds: string[] = company.adoptedid??[];
        const rejectedIds: string[] = company.rejectedid??[];
        if (rejectedIds.includes(studentid)) {
            setSnackMsg(`${studentname}はすでに不採用にしています`);
            setSnackOpen(true);
        } else if (adoptedIds?.includes(studentid)) {
            // 確認のUIを表示
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装
            const newApplyedIDArray = [...(company?.participants_id || [])].filter((aaa)=>aaa!==studentid);
            const newRejectedIDArray = [...(company?.rejectedid || []), studentid];
            const {error}= await supabase
                .from('company')
                .update({ participants_id: newApplyedIDArray,rejectedid:newRejectedIDArray})
                .eq("id",COMPANY_ID)
            if(error){
                setSnackMsg(`不採用に失敗しました`);
                setSnackOpen(true);
                return
            }
            handleSend();
            setSnackMsg(`${studentname}を不採用にしました`);
            setSnackOpen(true);
            //不採用通知の実装
        }
    };
    return(
        <>
        <Button onClick={() => adopt()}>不採用にする</Button>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose} message={snackMsg} />
        <Dialog open={confirmOpen} onClose={handleCancel}>
            <DialogTitle>{"注意"}</DialogTitle>
            <DialogContent>{studentname+"は採用されています"}<br />不採用にしますか</DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} color="inherit">不採用にする</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">キャンセル</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose}>
            <DialogTitle>ログインが必要です</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, py: 2 }}>
                    <Typography variant="body1">
                        不採用にするにはログインが必要です。
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
