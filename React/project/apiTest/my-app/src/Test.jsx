import React, { useState } from "react";

function TableApp() {
    const [data, setData] = useState([
        { 이름: "홍길동", 나이: "30", 직업: "개발자" },
        { 이름: "김철수", 나이: "25", 직업: "디자이너" },
        { 이름: "이영희", 나이: "35", 직업: "마케터" },
    ]);

    const [editableRow, setEditableRow] = useState(null);

    const handleEdit = (rowIndex) => {
        setEditableRow(rowIndex);
    };

    const handleSave = (rowIndex) => {
        setEditableRow(null);
        alert("저장되었습니다.");
    };

    const handleChange = (rowIndex, key, value) => {
        console.log('??');
        const newData = [...data];
        newData[rowIndex][key] = value;
        setData(newData);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                        <th>수정</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {Object.keys(row).map((key) => (
                                <td key={key}>
                                    {editableRow === index ? (
                                        <input
                                            type="text"
                                            value={row[key]}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        row[key]
                                    )}
                                </td>
                            ))}
                            <td>
                                {editableRow === index ? (
                                    <button onClick={() => handleSave(index)}>
                                        저장
                                    </button>
                                ) : (
                                    <button onClick={() => handleEdit(index)}>
                                        수정
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableApp;
