
import { useEffect, useState } from "react";
import "./index.css";

type Task = {
  id: number;
  name: string;
  due: string;
  priority: number;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks-ai") || "[]");
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("2");

  useEffect(() => {
    localStorage.setItem("tasks-ai", JSON.stringify(tasks));
  }, [tasks]);

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return Number(a.done) - Number(b.done);

    const score = (t: Task) =>
      t.priority * 100 -
      (new Date(t.due).getTime() - Date.now()) / 3600000;

    return score(b) - score(a);
  });

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !due) return;

    setTasks(old => [
      ...old,
      {
        id: Date.now(),
        name: name.trim(),
        due: new Date(due).toISOString(),
        priority: Number(priority),
        done: false,
      },
    ]);

    setName("");
    setDue("");
  }

  return (
    <main>
      <header>
        <p>✦ TRỢ LÝ CÁ NHÂN</p>
        <h1>Nhắc Việc AI</h1>
        <span>Hôm nay, làm việc thông minh hơn.</span>
      </header>

      <section>
        <h2>＋ Thêm công việc</h2>
        <form onSubmit={addTask}>
          <label>Tên công việc</label>
          <input
            placeholder="Ví dụ: Kiểm tra công việc..."
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label>Ngày giờ nhắc</label>
          <input
            type="datetime-local"
            value={due}
            onChange={e => setDue(e.target.value)}
            required
          />

          <label>Mức độ quan trọng</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="3">Cao</option>
            <option value="2">Vừa</option>
            <option value="1">Thấp</option>
          </select>

          <button>Thêm công việc</button>
        </form>
      </section>

      <section>
        <h2>Lịch trình của bạn</h2>
        {sorted.length === 0 && <p>Chưa có công việc nào 🌱</p>}

        {sorted.map(t => (
          <article key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() =>
                setTasks(old =>
                  old.map(x =>
                    x.id === t.id ? { ...x, done: !x.done } : x
                  )
                )
              }
            />
            <div className="info">
              <b className={t.done ? "done" : ""}>{t.name}</b>
              <small>
                {new Date(t.due).toLocaleString("vi-VN")}
              </small>
              <small>
                {t.done
                  ? "Đã hoàn thành"
                  : t.priority === 3
                  ? "🔴 Ưu tiên cao"
                  : t.priority === 2
                  ? "🟡 Ưu tiên vừa"
                  : "🟢 Ưu tiên thấp"}
              </small>
            </div>
            <button
              className="delete"
              onClick={() =>
                setTasks(old => old.filter(x => x.id !== t.id))
              }
            >
              ×
            </button>
          </article>
        ))}
      </section>

      <footer>Nhắc Việc AI · Phiên bản cá nhân</footer>
    </main>
  );
}
