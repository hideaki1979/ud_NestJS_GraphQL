import Header from "./Header"
import TaskTable from "./TaskTable"
import { useQuery } from "@apollo/client";
import type { Task } from "../types/task";
import { GET_TASKS } from "../queries/taskQueries";
import Loading from "./Loading";
import { Stack, Typography } from "@mui/material";
import AddTask from "./AddTask";
import { jwtDecode } from "jwt-decode";
import type { Payload } from "../types/payload";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate();

    const { loading, data, error } = useQuery<{ getTasks: Task[] }>(
        GET_TASKS,
        {
            // 初期表示時に必ずネットワークから最新データを取得
            fetchPolicy: 'cache-and-network',
            // エラー時のポリシー
            errorPolicy: 'all'
        }
    );

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('トークンが期限切れのため、ログイン画面に遷移します。');
        navigate('/signin');
        return;
    }
    const decodedToken = jwtDecode<Payload>(token);
    const userId = decodedToken.sub;


    return (
        <>
            <Header />
            <Stack
                spacing={4}
                direction="column"
                m={8}
                alignItems="center"
                // aria-hiddenエラーを回避するための設定
                role="main"
                tabIndex={-1}
            >
                {loading && <Loading />}
                {error && <Typography color="red">エラーが発生しました。</Typography>}
                {!loading && !error && (
                    <>
                        <AddTask userId={userId} />
                        <TaskTable tasks={data?.getTasks} />
                    </>
                )}
            </Stack>
        </>
    )
}

export default Main