import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import type { Task } from '../types/task';
import { CREATE_TASK } from '../mutations/taskMutations';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';

export default function AddTask({ userId }: { userId: number }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);
    const navigate = useNavigate();

    const resetState = () => {
        setName('');
        setDueDate('');
        setDescription('');
        setIsInvalidName(false);
        setIsInvalidDueDate(false);
    }

    const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isNameInvalid = name.length === 0
        setIsInvalidName(isNameInvalid);

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isDueDateInvalid = !dateRegex.test(dueDate) || !Date.parse(dueDate);
        setIsInvalidDueDate(isDueDateInvalid)

        if (!isNameInvalid && !isDueDateInvalid) {
            const createTaskInput = { name, dueDate, description, userId };
            try {
                await createTask({
                    variables: { createTaskInput },
                    // キャッシュ更新方法を改善
                    refetchQueries: [{
                        query: GET_TASKS,
                        fetchPolicy: 'network-only' // 必ずネットワークから取得
                    }],
                    awaitRefetchQueries: true
                })
                resetState();
                setOpen(false);
            } catch (err) {
                if (err instanceof ApolloError) {
                    const graphQLError = err.graphQLErrors.find(
                        (gqlError) => gqlError.extensions?.code === 'UNAUTHENTICATED'
                    );
                    if (graphQLError) {
                        console.error('タスク登録エラー：', graphQLError.message);
                        localStorage.removeItem('token');
                        alert('トークンの有効期限が切れました。サインイン画面に遷移します。');
                        navigate('/signin');
                        return;
                    }
                }
                console.error('タスク登録エラー：', err);
                alert('タスク登録エラーが発生しました');
                return;
            }
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        resetState();
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" sx={{ width: '280px' }} onClick={handleClickOpen}>
                Add Task
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth='sm'
                open={open}
                onClose={handleClose}
                // aria-hiddenエラーを回避するための設定
                disableRestoreFocus={true}
                aria-labelledby="add-task-dialog-title"
            >
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <form onSubmit={handleAddTask}>
                        <TextField
                            autoFocus
                            required
                            margin="normal"
                            id="name"
                            name="name"
                            label="タスク名"
                            fullWidth
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                            error={isInvalidName}
                            helperText={isInvalidName && 'タスク名を入力してください'}
                        />
                        <TextField
                            required
                            margin="normal"
                            id="dueDate"
                            name="dueDate"
                            label="期日"
                            placeholder='yyyy-mm-dd'
                            fullWidth
                            value={dueDate}
                            onChange={(e) => { setDueDate(e.target.value) }}
                            error={isInvalidDueDate}
                            helperText={isInvalidDueDate && '期日は日付形式で入力してください'}
                        />
                        <TextField
                            margin="normal"
                            id="description"
                            name="description"
                            label="説明・補足"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }}

                        />
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type='submit'>Add</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
