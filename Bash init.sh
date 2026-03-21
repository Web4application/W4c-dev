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
