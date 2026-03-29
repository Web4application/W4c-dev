# Clone the Homestead repository
git clone https://github.com/laravel/homestead.git ~/Homestead
# Checkout the release branch
cd ~/Homestead
git checkout release
# Initialize the Homestead configuration
bash init.sh # For macOS/Linux
init.bat # For Windows
npx wrangler deploy
> pip install sphinx_rtd_theme
> pip install breathe
> mkdir docs
> cd docs
> doxygen.exe -g
sudo nano /etc/hosts
# Install vLLM from pip:
pip install vllm
# Start the vLLM server:
vllm serve "nvidia/gpt-oss-puzzle-88B"
