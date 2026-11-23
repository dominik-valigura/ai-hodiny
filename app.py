# Run with: python3 app.py
from datetime import datetime
import time

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    now = datetime.now().astimezone()
    tz_offset_min = int(now.utcoffset().total_seconds() / 60)
    server_time = {
        "h": now.hour,
        "m": now.minute,
        "s": now.second,
        "ms": now.microsecond // 1000,
        "epoch_ms": int(time.time() * 1000),
        "tz_offset_min": tz_offset_min,
        "iso": now.isoformat(timespec="seconds"),
        "display": now.strftime("%H:%M:%S"),
    }
    return render_template("index.html", server_time=server_time)


if __name__ == "__main__":
    app.run(debug=True)
