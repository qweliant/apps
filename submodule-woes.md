Yes, that's the correct first step! By running:

bash
Copy code
git submodule add https://github.com/Rugz007/liha liha
You will:

Add the https://github.com/Rugz007/liha repository as a submodule under the liha directory in your current Git repository.
Track the submodule's repository and its current commit in your main repository.
Steps to Follow

1. Add the Submodule
   Run the command:

bash
Copy code
git submodule add https://github.com/Rugz007/liha liha
This will:

Clone the liha repository into the liha directory within your current repository.
Add a .gitmodules file in your repository to track the submodule. 2. Commit the Changes
After adding the submodule, you need to commit the changes in your main repository:

bash
Copy code
git add .gitmodules liha
git commit -m "Added liha as a submodule" 3. Clone the Parent Repository (for others or future setups)
When someone clones your repository (or when you clone it on another machine), they'll need to initialize and update the submodules. Use:

bash
Copy code
git clone --recurse-submodules <main-repo-url>
If they (or you) forget --recurse-submodules, they can initialize and fetch the submodule later with:

bash
Copy code
git submodule update --init --recursive 4. Update the Submodule (if needed)
To fetch the latest changes from the submodule repository:

bash
Copy code
cd liha
git pull origin main # Or the default branch of the submodule
cd ..
git add liha
git commit -m "Updated liha submodule"
Important Notes
If the liha repository changes in the future and you want to use a different commit or branch, you’ll need to update the submodule and commit the change in your parent repository.
Other developers or CI systems using your repository must always initialize and update the submodules after cloning.
Let me know if you encounter any issues!
