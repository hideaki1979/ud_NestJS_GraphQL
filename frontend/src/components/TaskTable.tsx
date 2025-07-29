import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { Task } from '../types/task';
import EditTask from './EditTask';
import { formatDate } from '../utils/dateUtils';
import DeleteTask from './DeleteTask';
import { Stack } from '@mui/material';

interface TaskTableProps {
    tasks: Task[] | undefined;
}

export default function TaskTable({ tasks }: TaskTableProps) {

    return (
        <TableContainer component={Paper} sx={{ width: '80%', m: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>タスク名</TableCell>
                        <TableCell align="right">期日</TableCell>
                        <TableCell align="right">ステータス</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks?.map((task) => (
                        <TableRow
                            key={task.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {task.name}
                            </TableCell>
                            <TableCell align="right">{formatDate(task.dueDate)}</TableCell>
                            <TableCell align="right">{task.status}</TableCell>
                            <TableCell align="right">
                                <Stack spacing={2} direction='row' justifyContent='flex-end' >
                                    <EditTask task={task} />
                                    <DeleteTask id={task.id} />
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
