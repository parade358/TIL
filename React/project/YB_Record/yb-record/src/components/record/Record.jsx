import React from "react";
import { Button } from "@mui/material";

export default function Record() {
    const MatchData_INSERT_URL = process.env.MatchData_INSERT_URL;

    const insertMatchData = () => {
        // 새로운 MatchData 객체 생성
        const matchData = {
            Opponent: 'Opponent Name', // 매치 상대팀 이름
            Location: 'Match Location', // 매치 장소
            MatchDate: new Date(), // 매치 날짜
            PlayerNames: 'Player 1, Player 2', // 플레이어 이름 목록
            Goals: [
                { PlayerName: 'Player 1', GoalQuarter: 1 }, // 골 정보
                { PlayerName: 'Player 2', GoalQuarter: 2 }
            ],
            Assists: [
                { PlayerName: 'Player 1', GoalQuarter: 1, AssistPlayerName: 'Player 2', AssistQuarter: 1 } // 어시스트 정보
            ]
        };

        fetch(MatchData_INSERT_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(matchData), // MatchData 객체를 JSON 문자열로 변환하여 전송
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // 성공적으로 데이터가 삽입된 후 실행할 작업
            console.log("Data inserted successfully:", data);
        })
        .catch((error) => {
            console.error("Error:", error.message);
        });
    };

    return (
        <>
            <Button onClick={insertMatchData} color="primary">추가</Button>
        </>
    );
};
