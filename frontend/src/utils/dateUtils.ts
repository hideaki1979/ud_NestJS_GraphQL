// 日付フォーマット変換
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`不正日付エラー： ${dateString}`);
    }
    return date.toISOString().split('T')[0];
};
