using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace YB_RECORD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchDataController : ControllerBase // 클래스 이름을 SampleController에서 MatchDataController로 변경
    {
        private readonly string _connectionString;

        // 생성자 수정: 주입받은 연결 문자열을 멤버 변수에 저장
        public MatchDataController(string connectionString) // 생성자 이름을 클래스 이름과 동일하게 변경
        {
            _connectionString = connectionString;
        }

        // 클라이언트로부터의 요청 데이터 형식을 정의하는 클래스
        public class MatchData
        {
            public string Opponent { get; set; }
            public string Location { get; set; }
            public DateTime MatchDate { get; set; }
            public string PlayerNames { get; set; }
            public List<GoalData> Goals { get; set; }
            public List<AssistData> Assists { get; set; }
        }
        public class GoalData
        {
            public string PlayerName { get; set; }
            public int GoalQuarter { get; set; }
        }
        public class AssistData
        {
            public string PlayerName { get; set; }
            public int GoalQuarter { get; set; }
            public string AssistPlayerName { get; set; }
            public int AssistQuarter { get; set; }
        }

        [HttpPost]
        public IActionResult Post([FromBody] MatchData requestDto)
        {
            int matchId = InsertMatchAndPlayers(requestDto.Opponent, requestDto.Location, requestDto.MatchDate, requestDto.PlayerNames);

            foreach (var goal in requestDto.Goals)
            {
                InsertGoalAndAssist(goal.PlayerName, matchId, goal.GoalQuarter);
            }

            foreach (var assist in requestDto.Assists)
            {
                InsertGoalAndAssist(assist.PlayerName, matchId, assist.GoalQuarter, assist.AssistPlayerName, assist.AssistQuarter);
            }

            return Ok("Data inserted successfully.");
        }


        private int InsertMatchAndPlayers(string opponent, string location, DateTime matchDate, string playerNames)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand command = new SqlCommand("InsertMatchAndPlayers", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@Opponent", opponent);
                command.Parameters.AddWithValue("@Location", location);
                command.Parameters.AddWithValue("@MatchDate", matchDate);
                command.Parameters.AddWithValue("@PlayerNames", playerNames);

                connection.Open();
                int matchId = (int)command.ExecuteScalar();
                return matchId;
            }
        }

        private void InsertGoalAndAssist(string playerName, int matchId, int goalQuarter, string assistPlayerName = null, int assistQuarter = 0)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand command = new SqlCommand("InsertGoalAndAssist", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@PlayerName", playerName);
                command.Parameters.AddWithValue("@MatchID", matchId);
                command.Parameters.AddWithValue("@GoalQuarter", goalQuarter);
                command.Parameters.AddWithValue("@AssistPlayerName", assistPlayerName);
                command.Parameters.AddWithValue("@AssistQuarter", assistQuarter);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
