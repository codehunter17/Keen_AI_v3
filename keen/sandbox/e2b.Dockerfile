# Keen Foundry — E2B base image for AI-authored ML training scripts.
# Pre-installs the ML stack so AI-generated code runs immediately without
# pip-install latency. Builds once, reused every Foundry job.

FROM e2bdev/code-interpreter:latest

# Pin versions so reproducibility doesn't drift on every base-image refresh.
RUN pip install --no-cache-dir \
    "scikit-learn==1.5.*" \
    "xgboost==2.1.*" \
    "pandas==2.2.*" \
    "numpy>=2.0,<3.0" \
    "scipy==1.14.*" \
    "onnx==1.17.*" \
    "skl2onnx==1.17.*" \
    "joblib==1.4.*"

# Pre-import to warm Python's bytecode cache. Saves ~600ms on first run.
RUN python -c "import sklearn, xgboost, pandas, numpy, scipy, onnx, skl2onnx, joblib"

# Untrusted scripts will be uploaded to /home/user/job/ at runtime.
RUN mkdir -p /home/user/job && chown -R user:user /home/user/job
WORKDIR /home/user/job
