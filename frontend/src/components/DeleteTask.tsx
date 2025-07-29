import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { ApolloError, useMutation } from "@apollo/client";
import { DELETE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

const DeleteTask = ({ id }: { id: number }) => {
    const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);
    const navigate = useNavigate();

    const handleDeleteTask = async () => {
        try {
            await deleteTask({
                variables: { id },
                // キャッシュ更新方法を改善
                refetchQueries: [{
                    query: GET_TASKS,
                    fetchPolicy: 'network-only' // 必ずネットワークから取得
                }],
                awaitRefetchQueries: true
            })
            alert('タスクを削除しました。');
        } catch (err) {
            if (err instanceof ApolloError) {
                const graphQLError = err.graphQLErrors.find(
                    (gqlError) => gqlError.extensions?.code === 'UNAUTHENTICATED'
                );
                if (graphQLError) {
                    console.error('タスク削除エラー：', graphQLError.message);
                    localStorage.removeItem('token');
                    alert('トークンの有効期限が切れました。サインイン画面に遷移します。');
                    navigate('/signin');
                    return;
                }
            }
            console.error('タスク削除エラー：', err);
            alert('タスク削除エラーが発生しました');
            return;
        }
    }

    return (
        <div>
            <Tooltip title='削除'>
                <IconButton
                    onClick={handleDeleteTask}
                    // aria-label追加でアクセシビリティ向上
                    aria-label={`タスクID ${id} を削除`}
                >
                    <DeleteIcon color='action' />
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default DeleteTask