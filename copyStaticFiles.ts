import * as shell from "shelljs";

shell.cp("-R", "src/config/indices", "dist/config/indices/");
shell.cp("-R", "src/uploads", "dist/uploads");
shell.cp("-R", "src/emailTemplates", "dist/emailTemplates");
