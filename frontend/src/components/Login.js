import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { User, Lock, Eye, EyeOff, AlertTriangle, ArrowRight, Sun, Moon } from "lucide-react";
import "./Login.css";

function AnimatedBg({ dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const blobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.2, r: 300, color: dark ? "rgba(124,111,255,0.12)" : "rgba(124,111,255,0.08)" },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, r: 250, color: dark ? "rgba(167,139,250,0.1)" : "rgba(167,139,250,0.06)" },
        { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 200, color: dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)" },
      ];

      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(167,139,250,${p.opacity})`
          : `rgba(124,111,255,${p.opacity * 0.5})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  return <canvas ref={canvasRef} className="login-canvas" />;
}

function Login({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) return setError("Please fill in all fields");
    if (password.length < 4) return setError("Password must be at least 4 characters");
    setLoading(true);
    setError("");
    const url = tab === "register"
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";
    try {
      const res = await axios.post(url, { username, password });
      if (tab === "register") {
        setError("");
        setTab("login");
        setUsername(username);
        setPassword("");
        setTimeout(() => setError(""), 100);
        alert("Account created! Please sign in.");
      } else {
        onLogin({ username: res.data.username, token: res.data.token, theme: dark ? "dark" : "light" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className={`login-bg ${dark ? "dark" : "light"}`}>
      <AnimatedBg dark={dark} />

      <button className="theme-pill" onClick={() => setDark(!dark)}>
        <span className="theme-pill-icon">{dark ? <Sun size={16} /> : <Moon size={16} />}</span>
        <span>{dark ? "Light mode" : "Dark mode"}</span>
      </button>

      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">💬</div>
          <div>
            <h1 className="brand-name">ChatApp</h1>
            <p className="brand-sub">Real-time · Secure · Dockerized</p>
          </div>
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}>
            Sign In
          </button>
          <button className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}>
            Register
          </button>
          <div className="tab-indicator"
            style={{ transform: `translateX(${tab === "login" ? "0%" : "100%"})` }} />
        </div>

        <div className="fields">
          <div className="field-wrap">
            <User className="field-icon" size={16} />
            <input className="field-input" placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div className="field-wrap">
            <Lock className="field-icon" size={16} />
            <input className="field-input" type={showPass ? "text" : "password"}
              placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-box">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : (
            <>
              <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="submit-arrow" size={16} />
            </>
          )}
        </button>

        <p className="switch-text">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button className="switch-btn"
            onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}>
            {tab === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;