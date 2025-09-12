'use client'

import {Button, Snackbar, Dialog, DialogContent, DialogActions, DialogTitle, Typography, Box}  from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

type Props = { companyid: string };
export default function ApplyButton({ companyid: companyid }: Props){
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [UItext, setUItext] = useState<string>('');
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const { user } = useAuth();
    const [companyname,setcompanyname]=useState<string>("");
    const STUDENT_ID = user?.id ?? '';
    const supabase = createClient();
    const handleSnackClose = () => setSnackOpen(false);
    const handleCancel = () => {
        setConfirmOpen(false);
    };
    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
    };
    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };
    const apply=async()=> {
        if (!user?.id) {
            setLoginDialogOpen(true);
            return;
        }
        const { data: current } = await supabase
                .from('company')
                .select('*')
                .eq('id', companyid)
                .single();
        setcompanyname(current?.name);
        const appliedIds: string[] = current?.participants_id || [];
        const adoptedIds: string[] = current?.adoptedid || [];
        const rejectedIds: string[] = current?.rejectedid || [];
        if (appliedIds?.includes(STUDENT_ID)) {
            setSnackMsg(`${companyname}にすでに応募しています`);
            setSnackOpen(true);
        } else if (adoptedIds?.includes(STUDENT_ID)) {
            setUItext(`あなたは${companyname}に採用されています`)
            setConfirmOpen(true);
        } else if (rejectedIds?.includes(STUDENT_ID)){
            setUItext(`あなたは${companyname}に不採用にされています`)
            setConfirmOpen(true);
        } else {
            //supabaseでのやつを実装

            const newArray = [...(current?.participants_id || []), STUDENT_ID];
            const { error } = await supabase
                .from('company')
                .update({ participants_id: newArray })
                .eq('id', companyid);
            if(error){
                setSnackMsg(`応募に失敗しました`);
                setSnackOpen(true);
                return
            }
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
        <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose}>
            <DialogTitle>ログインが必要です</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, py: 2 }}>
                    <Typography variant="body1">
                        応募するにはログインが必要です。
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