import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import type { Task } from '../types/task';
import { UPDATE_TASK } from '../mutations/taskMutations';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskStatus } from '../types/taskStatus';
import { formatDate } from '../utils/dateUtils';

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
]

export default function EditTask({ task }: { task: Task }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [dueDate, setDueDate] = useState(formatDate(task.dueDate));
    const [status, setStatus] = useState(task.status);
    const [description, setDescription] = useState(task.description || '');
    const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);
    const navigate = useNavigate();

    const resetState = () => {
        setName(task.name);
        setDueDate(formatDate(task.dueDate));
        setStatus(task.status);
        setDescription(task.description || '');
        setIsInvalidName(false);
        setIsInvalidDueDate(false);
    }

    const handleEditTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isNameInvalid = name.length === 0
        setIsInvalidName(isNameInvalid);

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isDueDateInvalid = !dateRegex.test(dueDate) || isNaN(Date.parse(dueDate));
        setIsInvalidDueDate(isDueDateInvalid)

        if (!isNameInvalid && !isDueDateInvalid) {
            const updateTaskInput = { id: task.id, name, dueDate, status, description };
            try {
                await updateTask({
                    variables: { updateTaskInput },
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
                        console.error('タスク編集エラー：', graphQLError.message);
                        localStorage.removeItem('token');
                        alert('トークンの有効期限が切れました。サインイン画面に遷移します。');
                        navigate('/signin');
                        return;
                    }
                }
                console.error('タスク編集エラー：', err);
                alert('タスク編集エラーが発生しました');
                return;
            }
        }
    }

    const handleClickOpen = () => {
        resetState();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title='編集'>
                <IconButton
                    onClick={handleClickOpen}
                    // aria-label追加でアクセシビリティ向上
                    aria-label={`タスク ${task.name} を編集`}
                >
                    <EditIcon color='action' />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth={true}
                maxWidth='sm'
                open={open}
                onClose={handleClose}
                // aria-hiddenエラーを回避するための設定
                disableRestoreFocus={true}
                aria-labelledby="edit-task-dialog-title"
            >
                <DialogTitle id="edit-task-dialog-title">Edit Task</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <form onSubmit={handleEditTask}>
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
                        <FormControl fullWidth={true} margin='normal'>
                            <InputLabel id='task-status-label'>ステータス</InputLabel>
                            <Select
                                labelId='task-status-label'
                                id='task-status'
                                label='Status'
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            >
                                {statusOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                            <Button type='submit'>Update</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
